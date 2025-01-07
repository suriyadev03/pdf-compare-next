import React, { useState } from 'react';
import { useParsePdfMutation } from '@/service/query/endpoints/parsePDFApi';
import { useDiffCheckMutation } from '@/service/query/endpoints/diffCheckApi';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './style/main.module.css'



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
      <div>
        <img className={styles.companyLogo} src="https://www.straive.com/wp-content/uploads/2024/12/straive-final-logo-184x48.png" alt="icon" />
      </div>
      <div className={styles.uploadPage}>
        <div>
          <div className={styles.headerSection}>
            <h1 className={styles.headTitle}>Compare PDF files</h1>
            <Image
              className={styles.iconImage}
              src="/assets/icon.png"
              alt="iconImage"
              width={100} 
              height={0}  
              style={{ height: 'auto' }} 
              layout="intrinsic" 
            />
            <p>Use our side-by-side PDF comparison software below to highlight changes</p>
          </div>
          <div className={styles.upload_pdf_Section}>
            <div className={styles.uploadToolWrapper}>
              <div className={styles.selectPdf}>
                <div className={styles.iconClass}>
                  <Image
                    className={styles.iconImage}
                    src="/assets/addFile.png"
                    alt="iconImage"
                    width={100} 
                    height={0}  
                    style={{ height: 'auto' }} 
                    layout="intrinsic" 
                  />
                </div>
                <span> Click Upload a Older PDF version here</span>
                <span className={styles.oldPdfName}>{file1 ? file1.name : 'No file chosen'}</span>
                <input type="file" className={styles.pdfSelector} name="pdf1" accept=".pdf" onChange={(e) => handleFileChange(e, 1)} />
              </div>
              <div className={styles.selectPdf}>
                <div>
                  <Image
                    className={styles.iconImage}
                    src="/assets/addFile.png"
                    alt="iconImage"
                    width={100} 
                    height={0}  
                    style={{ height: 'auto' }} 
                    layout="intrinsic" 
                  />
                </div>
                <span className={styles.subTitle}>Click Upload a Newer PDF version here</span>
                <span className={styles.newPdfName}>{file2 ? file2.name : 'No file chosen'}</span>
                <input type="file" className={styles.pdfSelector} name="pdf2" accept=".pdf" onChange={(e) => handleFileChange(e, 2)} />
              </div>
            </div>
            <button type="submit" disabled={!file1 || !file2} onClick={handleSubmit} className={styles.uploadButton}>
              {isParsing || isDiffing ? (
                <FaSpinner className={`animate-spin h-5 w-5 mr-3 text-white`} />
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
