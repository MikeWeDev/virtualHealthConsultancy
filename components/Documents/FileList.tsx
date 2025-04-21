// components/Documents/FileList.tsx

interface File {
    name: string;
    date: string;
  }
  
  const FileList = () => {
    const files: File[] = [
      { name: 'Medical Report.pdf', date: '2025-04-01' },
      { name: 'Prescription.pdf', date: '2025-04-05' },
    ];
  
    return (
      <div className="p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>
        <ul className="space-y-4">
          {files.map((file, idx) => (
            <li key={idx} className="p-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="font-bold">{file.name}</p>
              <p>{file.date}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FileList;
  