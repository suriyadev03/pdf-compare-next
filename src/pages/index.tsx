import React, { useState } from 'react';
import { useParsePdfMutation } from '@/service/query/endpoints/parsePDFApi';
import { useDiffCheckMutation } from '@/service/query/endpoints/diffCheckApi';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';
import '../styles/globals.css'
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

        if (parseResult.text1 && parseResult.text2) {
          const diffResult = await diffCheck({ text1: parseResult.text1, numPages: parseResult.numPages, text2: parseResult.text2, nextPage: 1 }).unwrap();
          console.log("Diff Result:", diffResult);
          router.push('/compare')
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    // <div>
    //   <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 1)} />
    //   <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 2)} />
    //   <button
    //     onClick={handleSubmit}
    //     disabled={isParsing || isDiffing}
    //     className={`mt-4 px-6 py-2 rounded bg-blue-500 text-white flex items-center justify-center ${isParsing || isDiffing ? 'opacity-50 cursor-not-allowed' : ''}`}
    //   >
    //     {isParsing || isDiffing ? (
    //       <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
    //     ) : (
    //       'Upload'
    //     )}
    //   </button>
    // </div>
    <>
      <div className='companyLogo'>
        <img src="https://www.straive.com/wp-content/uploads/2024/12/straive-final-logo-184x48.png" alt="icon" />
      </div>
    <div className='uploadPage'>
      <div className=''>
        <div className='header-section'>
          <h1>Compare PDF files</h1>
          <Image
            className="icon_image"
            src="/assets/icon.png"
            alt="icon_image"
            width={100} // Set the width
            height={0}  // Set height as 0 (for intrinsic layout)
            style={{ height: 'auto' }} // Ensure the height is auto with inline styling
            layout="intrinsic" // This keeps the aspect ratio intact
          />
          <p>Use our side-by-side PDF comparison software below to highlight changes</p>
        </div>
        <div className='upload_pdf_Section'>
          <div className='upload_tool_wrapper'>
            <div className="selectPdf">
              <div className='icon-class'>
                <Image
                  className="icon_image"
                  src="/assets/addFile.png"
                  alt="icon_image"
                  width={100} // Set the width
                  height={0}  // Set height as 0 (for intrinsic layout)
                  style={{ height: 'auto' }} // Ensure the height is auto with inline styling
                  layout="intrinsic" // This keeps the aspect ratio intact
                />
              </div>
              <span> Click Upload a Older PDF version here</span>
              <div className="pdf-wrapper">
                <canvas id="pdf-canvas-old"></canvas>
                <div id="remove-old-pdf" className="remove-pdf"><i className="fa fa-close"></i>
                </div>
              </div>
              <span className="old-pdf-name">{file1 ? file1.name : 'No file chosen'}</span>
              <input type="file" className="pdf-selector" id="old-pdf-selector" name="pdf1" accept=".pdf" onChange={(e) => handleFileChange(e, 1)} />
            </div>
            <div className="selectPdf">
              <div className='icon-class iconcls2'>
                <Image
                  className="icon_image"
                  src="/assets/addFile.png"
                  alt="icon_image"
                  width={100} // Set the width
                  height={0}  // Set height as 0 (for intrinsic layout)
                  style={{ height: 'auto' }} // Ensure the height is auto with inline styling
                  layout="intrinsic" // This keeps the aspect ratio intact
                />
              </div>
              <span>Click Upload a Newer PDF version here</span>
              <div className="pdf-wrapper">
                <canvas id="pdf-canvas-new"></canvas>
                <div id="remove-new-pdf" className="remove-pdf"><i className="fa fa-close"></i>
                </div>
              </div>
              <span className="new-pdf-name">{file2 ? file2.name : 'No file chosen'}</span>
              <input type="file" className="pdf-selector" id="new-pdf-selector" name="pdf2" accept=".pdf" onChange={(e) => handleFileChange(e, 2)} />
            </div>
          </div>
          <button type="submit" disabled={!file1 || !file2} onClick={handleSubmit} className='flex justify-center'>
            {isParsing || isDiffing ? (
              <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
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
