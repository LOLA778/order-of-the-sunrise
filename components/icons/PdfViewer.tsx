
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface PdfViewerProps {
    pdfData: string; // Base64 data URL
    initialPage: number;
    onPageChange: (page: number) => void;
    onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfData, initialPage, onPageChange, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRendering, setIsRendering] = useState(false);
    const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(pdfData);
        loadingTask.promise.then(loadedPdf => {
            setPdf(loadedPdf);
            setTotalPages(loadedPdf.numPages);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error loading PDF:", error);
            setIsLoading(false);
        });

        // Cleanup function to destroy PDF object on component unmount
        return () => {
            if (pdf) {
                pdf.destroy();
            }
        };
    }, [pdfData]);

    const renderPage = useCallback((pageNumber: number) => {
        if (!pdf) return;
        
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
        }

        setIsRendering(true);
        pdf.getPage(pageNumber).then(page => {
            const canvas = canvasRef.current;
            if (!canvas) {
                setIsRendering(false);
                return;
            }

            const container = canvas.parentElement;
            if (!container) {
                setIsRendering(false);
                return;
            }

            const viewport = page.getViewport({ scale: container.clientWidth / page.getViewport({scale: 1}).width });
            const context = canvas.getContext('2d');
            if (!context) {
                setIsRendering(false);
                return;
            };
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            renderTaskRef.current = page.render(renderContext as any);
            renderTaskRef.current.promise.then(() => {
                setIsRendering(false);
            }).catch(() => {
                setIsRendering(false);
            });
        });
    }, [pdf]);
    
    useEffect(() => {
      const handleResize = () => {
        if(pdf) renderPage(currentPage);
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize)
    }, [pdf, currentPage, renderPage])

    useEffect(() => {
        if (pdf) {
            renderPage(currentPage);
            onPageChange(currentPage);
        }
    }, [pdf, currentPage, onPageChange]);

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };
    
    return (
      <>
        <div className="fixed inset-0 bg-[#1A0A0A] z-50 flex flex-col">
            <header className="flex justify-between items-center p-2 bg-glass-red backdrop-blur-lg border-b border-gold/30 shadow-sm flex-shrink-0">
                <button onClick={onClose} className="px-4 py-2 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow">
                    &larr; Закрыть
                </button>
                 <div className="flex items-center gap-4">
                    <button onClick={goToPrevPage} disabled={currentPage <= 1 || isRendering} className="px-4 py-2 bg-black/30 text-steel-gray rounded-lg disabled:opacity-50">
                        Назад
                    </button>
                    <span className="font-mono text-lg text-warm-white">{currentPage} / {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage >= totalPages || isRendering} className="px-4 py-2 bg-black/30 text-steel-gray rounded-lg disabled:opacity-50">
                        Вперед
                    </button>
                </div>
                <div className="w-28"></div> 
            </header>
            <main className="flex-grow overflow-auto flex justify-center p-4">
                 {isLoading ? (
                    <p className="text-steel-gray">Загрузка книги...</p>
                 ) : (
                    <div className="relative shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
                        <canvas ref={canvasRef} className={`transition-opacity duration-300 ${isRendering ? 'opacity-50' : ''}`} />
                        {isRendering && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                               <div className="w-12 h-12 border-4 border-t-gold border-gold/20 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                 )}
            </main>
        </div>
        <style>{`.text-warm-white{color:#F8F0E3}.text-gold{color:#FFD700}.text-steel-gray{color:#C0A080}.bg-fire-gradient{background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700)}.hover\\:shadow-fire-glow:hover{box-shadow: 0 0 15px rgba(255, 107, 53, 0.6)}.bg-glass-red{background-color:rgba(44,21,21,0.4)}.border-gold\\/30{border-color:rgba(255,215,0,0.3)}.border-gold\\/20{border-color:rgba(255,215,0,0.2)}`}</style>
      </>
    );
};

export default PdfViewer;
