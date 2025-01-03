import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useDiffCheckMutation } from "@/service/query/endpoints/diffCheckApi";
import { RootState } from "@/store";
import { v4 as uuidv4 } from 'uuid';
import Loader from "./loader";
import ReactPaginate from "react-paginate";


const ComparePdf = () => {
  const { diff, numPages, pdf1Texts, pdf2Texts } = useSelector((state: RootState) => state.application);

  const [diffCheck, { isLoading }] = useDiffCheckMutation();
  const router = useRouter();
  const [diffData, setDiffData] = useState<any[]>([]);
  const [diffChanges, setDiffChanges] = useState<any[]>([]);

  useEffect(() => {
    if (!diff.length) {
      router.push('/')
    }
    renderChanges(diff)
  }, [])


  const loadNextPage = async (event: any) => {
    const selectpage = event.selected;

    try {
      const response = await diffCheck({ pdf1PageText: pdf1Texts[selectpage + 1], pdf2PageText: pdf2Texts[selectpage + 1] }).unwrap();
      renderChanges(response.diff);

    } catch (err) {
      console.error("Error loading next page:", err);
    }
  };

  const renderChanges = (diffWords = diff) => {

    const updatedChanges: any[] = [];
    const renderedContent: any[] = [];
    diffWords.forEach((item, index) => {
      let uuid = uuidv4()
      const changes: any = { ...item };
      changes.highlightClass = `hightlight_${uuid}`;

      if (item.removed) {
        changes.newPdf = `show_${uuid}`;
        if (diffWords[index + 1]?.added) {
          changes.title = 'Replaced';
          changes.addedText = diffWords[index + 1].value;
          changes.removedText = item.value;
          changes.oldPdf = `show_${uuid}`;
        } else {
          changes.title = 'Removed';
          changes.removedText = item.value;
          changes.oldPdf = `show_${uuid}`;
        }
      } else if (item.added) {
        if (!diffWords[index - 1]?.removed) {
          changes.title = 'Added';
          changes.addedText = item.value;
          changes.newPdf = `show_${uuid}`;
        }
      }

      if (changes.title) {
        updatedChanges.push(changes);
      }

      const textParts = item.value.split(/\n/);

      const mappedData = textParts.map((part: any, partIndex: any) => {

        const content = (
          <span id={`show_${uuid}`} key={`${index}-${partIndex}`} className={
            `${item.added ? `text-green-500 added` : item.removed ? `text-red-500 removed` : ""} 
            ${changes.highlightClass}
            `
          }>
            {part}
            {partIndex < textParts.length - 1 && <br />}
          </span>
        );

        return (
          <React.Fragment key={`${index}-${partIndex}`}>
            {content}
          </React.Fragment>
        );
      });
      renderedContent.push(mappedData)
      setDiffData(renderedContent)
    });
    setDiffChanges(updatedChanges);
  };

  const handleScrollToChange = (highlightClass: string, isReplaced = false) => {
    const highlightElements = document.getElementsByClassName(highlightClass);

    const highlights = document.getElementsByClassName('highlight');

    for (let i = highlights.length - 1; i >= 0; i--) {
      highlights[i].classList.remove('highlight');
    }
    if (isReplaced) {
      const nextHiglightElement = highlightElements[highlightElements.length - 1].nextElementSibling?.className || '';
      const highlightClasses = nextHiglightElement.split(' ').find(className => className.startsWith('hightlight_')) || '';
      const nextHighlightElements = document.getElementsByClassName(highlightClasses);
      for (let i of nextHighlightElements) {

        i?.classList?.add('highlight')
      }
    }

    for (let i of highlightElements) {
      i?.classList?.add('highlight')
    }

    if (highlightElements[0]) {
      highlightElements[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

  };


  return (
    <>
      <div className='container'>
      <img className='icon-logo' alt="icon" src="https://www.straive.com/wp-content/uploads/2024/12/straive-final-logo-184x48.png"/>
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
                onClick={() => handleScrollToChange(changes.highlightClass, changes.title === 'Replaced')}
              >
                <span>{i + 1}. {changes.title}</span>
                <span style={{ color: 'green' }}>{changes.addedText}</span>
                <span style={{ color: 'red' }}>{changes.removedText}</span>
              </div>
            ))}
            <div className="pagination">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={loadNextPage}
                pageRangeDisplayed={3}
                pageCount={numPages}
                previousLabel="<"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>

      </div>
      {
        isLoading && <Loader />
      }
    </>
  );
};

export default ComparePdf;
