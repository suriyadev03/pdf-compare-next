import React, { useState } from 'react';
import { useParsePdfMutation } from '@/service/query/endpoints/parsePDFApi';
import { useDiffCheckMutation } from '@/service/query/endpoints/diffCheckApi';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';
import styles from '../styles/globals.module.css'
import Image from 'next/image';

const FileUploadComponent = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [parsePdf, { isLoading: isParsing }] = useParsePdfMutation();
  const [diffCheck, { isLoading: isDiffing }] = useDiffCheckMutation();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (fileNumber === 1) {
        setFile1(file);
      } else {
        setFile2(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (file1 && file2) {
      try {
        const parseResult = await parsePdf({ pdf1: file1, pdf2: file2 }).unwrap();

        if (parseResult.pdf1Texts[1] && parseResult.pdf2Texts[1]) {
          await diffCheck({
            pdf1PageText: parseResult.pdf1Texts[1],
            pdf2PageText: parseResult.pdf2Texts[1]
          }).unwrap();
          router.push('/compare')
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <>
      <div className={styles.uploadPage}>
        <div>
          <div className={styles.headerSection}>
          <img className={styles.login_page_icon} src="https://www.straive.com/wp-content/uploads/2024/12/straive-final-logo-184x48.png" alt="icon" />
            <h1>Compare PDF files</h1>
            <Image
              className={styles.icon_image}
                // compare_icon"
              src="/assets/icon.png"
              alt="icon_image"
              width={100} 
              height={0}  
              style={{ height: 'auto' }} 
              layout="intrinsic" 
            />
            <p>Use our side-by-side PDF comparison software below to highlight changes</p>
          </div>
          <div className={styles.upload_pdf_Section}>
            <div className={styles.upload_tool_wrapper}>
              <div className={styles.selectPdf}>
                <div className={styles.iconClass}>
                  <Image
                    className={styles.icon_image}
                    src="/assets/addFile.png"
                    alt="icon_image"
                    width={100} 
                    height={0}  
                    style={{ height: 'auto' }} 
                    layout="intrinsic" 
                  />
                </div>
                <span> Click Upload a Older PDF version here</span>
                <div className={styles.pdfWrapper}>
                  <canvas></canvas>
                  <div className={styles.removePdf}>
                  </div>
                </div>
                <span className={styles.oldPdfName}>{file1 ? file1.name : 'No file chosen'}</span>
                <input type="file" className={styles.pdfSelector} name="pdf1" accept=".pdf" onChange={(e) => handleFileChange(e, 1)} />
              </div>
              <div className={styles.selectPdf}>
                <div className={styles.iconcls2}>
                  <Image
                    className={styles.icon_image}
                    src="/assets/addFile.png"
                    alt="icon_image"
                    width={100} 
                    height={0}  
                    style={{ height: 'auto' }} 
                    layout="intrinsic" 
                  />
                </div>
                <span>Click Upload a Newer PDF version here</span>
                <div className={styles.pdfWrapper}>
                  <canvas></canvas>
                  <div className={styles.removePdf}>
                  </div>
                </div>
                <span className={styles.newPdfName}>{file2 ? file2.name : 'No file chosen'}</span>
                <input type="file" className={styles.pdfSelector} name="pdf2" accept=".pdf" onChange={(e) => handleFileChange(e, 2)} />
              </div>
            </div>
            <button type="submit" disabled={!file1 || !file2} onClick={handleSubmit} 
            // className={styles.flex justify-center'
              >
              {isParsing || isDiffing ? (
                <FaSpinner className={styles.animateSpin}
                //  h-5 w-5 mr-3 text-white" 
                 />
              ) : (
                'Compare'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadComponent;
