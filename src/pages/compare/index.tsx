import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useDiffCheckMutation } from "@/service/query/endpoints/diffCheckApi";
import { RootState } from "@/store";

const ComparePdf = () => {
    const { text1, text2, diff, currentPage,diffCurrentWords, numPages } = useSelector((state: RootState) => state.application);
    const [diffCheck, { isLoading, isSuccess }] = useDiffCheckMutation();
    const router = useRouter();
    const [diffData, setDiffData] = useState<any[]>([]);
    const [diffChanges, setDiffChanges] = useState<any[]>([]);

    useEffect(()=>{
        if(!text1){
            router.push('/')
        }
        renderChanges()
        console.log("diffChangesdiffChanges", diffChanges);
        
    },[])
    

    const loadNextPage = async () => {
        try {
            const response = await diffCheck({ text1, text2, nextPage: currentPage + 1, numPages }).unwrap();
            renderChanges(diffCurrentWords);
        } catch (err) {
            console.error("Error loading next page:", err);
        }
    };
    
    const renderChanges = (newDiffCurrentWords = diffCurrentWords) => {
        
        const updatedChanges = [...diffChanges];
        const renderedContent = [...diffData];
        newDiffCurrentWords.forEach((item, index) => {
            const changes = {
                title: '',
                addedText: '',
                removedText: '',
                pointerName: '',
                oldPdf: '',
                newPdf: '',
                oldPdfId : '',
                newPdfId : '',
            };
    
            if (item.removed) {
                changes.newPdf = `show_${index}-`;
                if (newDiffCurrentWords[index + 1]?.added) {
                    changes.title = 'Replaced';
                    changes.addedText = newDiffCurrentWords[index + 1].value;
                    changes.removedText = item.value;
                    changes.oldPdf = `show_${index}-`;
                } else {
                    changes.title = 'Removed';
                    changes.removedText = item.value;
                    changes.oldPdf = `show_${index}-`;
                }
            } else if (item.added) {
                if (!newDiffCurrentWords[index - 1]?.removed) {
                    changes.title = 'Added';
                    changes.addedText = item.value;
                    changes.newPdf = `show_${index}-`;
                }
            }
    
            changes.pointerName = `scrollPoint_${index}-`;
    
            if (changes.title) {
                updatedChanges.push(changes);             
            }

            const textParts = item.value.split(/\n/);
    
            const mappedData =  textParts.map((part: any, partIndex: any) => {
                const content = (
                    <span key={`${index}-${partIndex}`} className={item.added ? `text-green-500 added ${changes.newPdf}` : item.removed ? `text-red-500 removed ${changes.oldPdf}` : ""}>
                        {part}
                    </span>
                );
    
                return (
                    <React.Fragment key={`${index}-${partIndex}`}>
                        {content}
                        {partIndex < textParts.length - 1 && <br />}
                    </React.Fragment>
                );
            });
            renderedContent.push(mappedData)
            setDiffData(renderedContent)
        });    
        setDiffChanges(updatedChanges);
    };
    
    
    const renderDiff = (newDiffCurrentWords = diffCurrentWords) => {
        // Create a local array to accumulate the changes
    
        // Process the diff array
        const renderedContent : any[] = []
        
        newDiffCurrentWords.forEach((item, index) => {
            const textParts = item.value.split(/\n/);
    
            const mappedData =  textParts.map((part: any, partIndex: any) => {
                const content = (
                    <span key={`${index}-${partIndex}`} className={item.added ? "text-green-500 added" : item.removed ? "text-red-500 removed" : ""}>
                        {part}
                    </span>
                );
    
                return (
                    <React.Fragment key={`${index}-${partIndex}`}>
                        {content}
                        {partIndex < textParts.length - 1 && <br />}
                    </React.Fragment>
                );
            });
            renderedContent.push(mappedData)
        });
    
        return renderedContent;
    };
    
    

    useEffect(() => {
        if (currentPage === 0) {
            loadNextPage();
        }
    }, [currentPage]);
    return (
        // <div className="space-y-4 p-4">
        //     <h1 className="text-2xl font-bold">Compare PDFs</h1>

        //     <div className="space-y-2">
        //         <h2 className="text-xl">Differences</h2>
        //         <div>{renderDiff(diff)}</div>
        //     </div>

        //     <div className="mt-4 flex justify-between">
        //         <button
        //             onClick={() => router.push("/")}
        //             className="bg-gray-500 text-white px-6 py-2 rounded"
        //         >
        //             Back
        //         </button>

        //         <button
        //             onClick={loadNextPage}
        //             disabled={isLoading || diff.length === 0} // Disable if no diff or still loading
        //             className={`bg-blue-500 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        //         >
        //             {isLoading ? "Loading..." : "Next Page"}
        //         </button>
        //     </div>
        // </div>

        <>
        <div className='companyLogo'>
        <img src="https://www.straive.com/wp-content/uploads/2024/12/straive-final-logo-184x48.png" alt="icon" />
      </div>
        <div className='container'>
        <div className='PreviewPage'>
          <div className='PdfDiffView'>
            <div className='oldPdf'>
              <div className='pdfName'>Old PDF: <b></b></div>
              <div className='pdf_Section_content'>
                <div>{diffData}</div>
              </div>
            </div>
            <div className='newPdf' >
              <div className='pdfName'>New PDF: <b></b></div>
              <div className='pdf_Section_content'>
                {/* {diffResult.map((result) => (
                  <span key={result.id} id={result.id}>
                    {result.span}
                  </span>
                ))} */}
                <div>{diffData}</div>
              </div>
            </div>
          </div>
          <div className='changesShow'>
            <span>Changes:</span>
            {diffChanges.map((changes, i) => (
              <div
                key={`change_${i}_${changes.title}`}
                className='changesContainer'
                // onClick={() => handleScrollToChange(changes.pointerName, changes.oldPdf, changes.newPdf, changes.title)}
              >
                <span>{i + 1}. {changes.title}</span>
                <span style={{ color: 'green' }}>{changes.addedText}</span>
                <span style={{ color: 'red' }}>{changes.removedText}</span>
              </div>
            ))}
          </div>
        </div>
                 <button
                     onClick={loadNextPage}
                     disabled={isLoading || diff.length === 0} // Disable if no diff or still loading
                     className={`loadMoreBtn bg-blue-500 text-white px-6 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                     {isLoading ? "Loading..." : "View More"}
                 </button>
      </div>
      </>
    );
};

export default ComparePdf;
