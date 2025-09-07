
import React, { useState, useEffect, useRef } from 'react';
import { Book, ReadingPlan, UserData } from '../types';
import Card from './shared/Card';
import ProgressBar from './shared/ProgressBar';
import PdfViewer from './PdfViewer';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

interface ReadingViewProps {
    plan: ReadingPlan;
    currentBook: Book;
    userData: UserData;
    updateBookProgress: (page: number) => void;
    customBooks: Book[];
    onAddCustomBook: (book: Omit<Book, 'author'|'pages'> & { content: string, pages: number, author: string }) => void;
    onRemoveCustomBook: (bookId: string) => void;
    onUpdateCustomBookProgress: (bookId: string, page: number) => void;
    uploadBookForPlan: (bookTitle: string, content: string) => void;
}

const ReadingView: React.FC<ReadingViewProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'plan' | 'library'>('plan');
    const [readingCustomBook, setReadingCustomBook] = useState<Book | null>(null);
    const [isReadingPlanBook, setIsReadingPlanBook] = useState(false);

    const planBookContent = props.userData.planBookContent?.[props.currentBook.title];

    if (isReadingPlanBook && planBookContent) {
        return (
            <PdfViewer
                pdfData={planBookContent}
                initialPage={props.userData.currentBookPage || 1}
                onPageChange={props.updateBookProgress}
                onClose={() => setIsReadingPlanBook(false)}
            />
        );
    }
    
    if (readingCustomBook && readingCustomBook.content) {
        return (
            <PdfViewer
                pdfData={readingCustomBook.content}
                initialPage={readingCustomBook.currentPage || 1}
                onPageChange={(page) => props.onUpdateCustomBookProgress(readingCustomBook.id!, page)}
                onClose={() => setReadingCustomBook(null)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-4xl md:text-5xl font-black text-warm-white tracking-tight">Разум</h1>
            </header>

            <Card className="!p-1">
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('plan')}
                        className={`w-full py-2 px-4 rounded-xl font-bold transition-all ${activeTab === 'plan' ? 'bg-black/30 text-gold shadow-md' : 'text-steel-gray hover:bg-black/20'}`}
                    >
                        План Чтения
                    </button>
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`w-full py-2 px-4 rounded-xl font-bold transition-all ${activeTab === 'library' ? 'bg-black/30 text-gold shadow-md' : 'text-steel-gray hover:bg-black/20'}`}
                    >
                        Библиотека
                    </button>
                </div>
            </Card>

            {activeTab === 'plan' && <ReadingPlanView {...props} onReadBook={() => setIsReadingPlanBook(true)} />}
            {activeTab === 'library' && <LibraryView {...props} onReadBook={setReadingCustomBook} />}
            <style>{`.text-warm-white{color:#F8F0E3}.text-gold{color:#FFD700}.text-steel-gray{color:#C0A080}`}</style>
        </div>
    );
};

// Reading Plan sub-component
interface ReadingPlanViewProps extends Omit<ReadingViewProps, 'customBooks' | 'onAddCustomBook' | 'onRemoveCustomBook' | 'onUpdateCustomBookProgress'> {
    onReadBook: () => void;
}

const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({ plan, currentBook, userData, updateBookProgress, uploadBookForPlan, onReadBook }) => {
    const [pageInput, setPageInput] = useState(userData.currentBookPage.toString());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bookContent = userData.planBookContent?.[currentBook.title];

    useEffect(() => {
        setPageInput(userData.currentBookPage.toString());
    }, [userData.currentBookPage]);

    const handleUpdate = () => {
        const page = parseInt(pageInput, 10);
        if (!isNaN(page)) {
            updateBookProgress(page);
        }
    };
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                uploadBookForPlan(currentBook.title, dataUrl);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Пожалуйста, выберите файл в формате PDF.");
        }
    };

    const bookProgressPercentage = Math.round((userData.currentBookPage / currentBook.pages) * 100);
    const totalPlanPages = plan.books.reduce((sum, book) => sum + book.pages, 0);
    const completedPagesInPlan = plan.books
        .slice(0, userData.currentBookIndex)
        .reduce((sum, book) => sum + book.pages, 0) + userData.currentBookPage;
    const planProgressPercentage = Math.round((completedPagesInPlan / totalPlanPages) * 100);

    return (
        <div className="space-y-6">
             <Card>
                <h2 className="text-lg font-bold text-steel-gray">Текущая книга:</h2>
                <p className="text-2xl font-bold text-warm-white">{currentBook.title}</p>
                <p className="text-md text-steel-gray mb-4">{currentBook.author}</p>
                
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-steel-gray">Прогресс по книге</span>
                    <span className="font-bold text-gold">{bookProgressPercentage}%</span>
                </div>
                <ProgressBar percentage={bookProgressPercentage} />
                <p className="text-right text-xs text-steel-gray/70 mt-1">{userData.currentBookPage} / {currentBook.pages} страниц</p>
                
                <div className="mt-4">
                    <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    {bookContent ? (
                        <button onClick={onReadBook} className="w-full py-3 bg-black/30 border border-gold/50 text-gold font-bold rounded-lg hover:bg-black/40 transition-colors">
                            Читать книгу
                        </button>
                    ) : (
                         <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow transition-shadow">
                            Загрузить PDF
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center space-x-4">
                    <input
                        type="number"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onBlur={handleUpdate}
                        className="w-full bg-black/30 border border-gold/30 rounded-lg p-3 text-center text-lg text-warm-white font-bold focus:ring-gold focus:border-gold"
                        min="0"
                        max={currentBook.pages}
                    />
                     <button onClick={handleUpdate} className="px-5 py-3 bg-fire-gradient text-black font-bold rounded-lg">
                        OK
                    </button>
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-bold text-steel-gray mb-3">Прогресс по всему плану</h2>
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-steel-gray">Книга {userData.currentBookIndex + 1} из {plan.books.length}</span>
                    <span className="font-bold text-gold">{planProgressPercentage}%</span>
                </div>
                <ProgressBar percentage={planProgressPercentage} />
                 <p className="text-sm text-steel-gray mt-2">Дневная норма: ~{plan.dailyGoal} страниц</p>
            </Card>
        </div>
    );
}

// Library sub-component
const LibraryView: React.FC<Pick<ReadingViewProps, 'customBooks' | 'onAddCustomBook' | 'onRemoveCustomBook'> & { onReadBook: (book: Book) => void }> = ({ customBooks, onAddCustomBook, onRemoveCustomBook, onReadBook }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const dataUrl = event.target?.result as string;
                try {
                    const loadingTask = pdfjsLib.getDocument(dataUrl);
                    const pdf = await loadingTask.promise;
                    const metadata = await pdf.getMetadata();
                    const title = (metadata.info as any)?.Title || file.name.replace('.pdf', '');
                    const author = (metadata.info as any)?.Author || 'Неизвестен';

                    onAddCustomBook({ title, author, pages: pdf.numPages, content: dataUrl });

                } catch (error) {
                    console.error("Error reading PDF:", error);
                    alert("Не удалось обработать PDF файл.");
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert("Пожалуйста, выберите файл в формате PDF.");
        }
    };
    
    return (
        <div className="space-y-4">
             <style>{`.text-warm-white{color:#F8F0E3}.text-gold{color:#FFD700}.text-steel-gray{color:#C0A080}.bg-fire-gradient{background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700)}.hover\\:shadow-fire-glow:hover{box-shadow: 0 0 15px rgba(255, 107, 53, 0.6)}.border-gold{border-color:#FFD700}.ring-gold:focus{--tw-ring-color:#FFD700}`}</style>
            <Card>
                <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow transition-shadow">
                    + Загрузить книгу (PDF)
                </button>
            </Card>

            {customBooks.length === 0 ? (
                <p className="text-center text-steel-gray pt-8">Ваша библиотека пуста.</p>
            ) : (
                customBooks.map(book => (
                    <Card key={book.id} className="flex flex-col">
                        <div>
                            <h3 className="text-xl font-bold text-warm-white truncate">{book.title}</h3>
                            <p className="text-sm text-steel-gray mb-3">{book.author}</p>
                            <ProgressBar percentage={Math.round(((book.currentPage || 0) / book.pages) * 100)} />
                             <p className="text-right text-xs text-steel-gray/70 mt-1">{book.currentPage || 0} / {book.pages} страниц</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => onReadBook(book)} className="flex-grow py-2 bg-black/30 border border-gold/50 text-gold font-bold rounded-lg hover:bg-black/40">
                                Читать
                            </button>
                             <button onClick={() => onRemoveCustomBook(book.id!)} className="px-4 py-2 bg-fire-red/20 text-fire-red font-bold rounded-lg hover:bg-fire-red/30">
                                X
                            </button>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
};


export default ReadingView;
