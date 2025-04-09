// 📁 src/pages/ArchivePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile, embedFile } from '../api/fileApi';
import { v4 as uuidv4 } from 'uuid';
import './ArchivePage.css';

const ArchivePage = () => {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);

  const username = localStorage.getItem('username') || '2';

  useEffect(() => {
    localStorage.setItem('username', username);

    const savedFiles = localStorage.getItem('files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        const validFiles = parsedFiles.filter(file => file && file.name && file.id);
        setFiles(validFiles);
      } catch (err) {
        console.error('파일 파싱 오류:', err);
        localStorage.removeItem('files');
      }
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder = {
      id: uuidv4(),
      name: newFolderName,
      color: '#1B512D',
      path: [...currentPath],
    };
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const handleFolderClick = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const handlePathClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', username);
    formData.append('folderId', 1);
  
    try {
      const res = await uploadFile(formData);
      console.log('업로드 응답:', res);
  
      // 1. 문자열에서 URL 추출
      const responseStr = res.data;
      const urlMatch = responseStr.match(/S3 URL:\s*(https?:\/\/[^\s]+)/);
      const fileUrl = urlMatch ? urlMatch[1] : null;
  
      if (!fileUrl) {
        console.error('파일 URL을 파싱하지 못했습니다.');
        return;
      }
  
      const newFile = {
        id: uuidv4(),
        name: selectedFile.name,
        path: [...currentPath],
        fileUrl: fileUrl,
        type: selectedFile.type,
      };
  
      console.log('추가할 파일:', newFile);
  
      setFiles(prev => {
        const updated = [...prev, newFile];
        localStorage.setItem('files', JSON.stringify(updated));
        return updated;
      });
  
      const embedRes = await embedFile(selectedFile);
      console.log('임베딩 성공:', embedRes.message);
    } catch (err) {
      console.error('업로드 또는 임베딩 실패:', err);
    }
  };

  const displayedFolders = folders.filter(
    folder => JSON.stringify(folder.path) === JSON.stringify(currentPath)
  );

  const displayedFiles = files.filter(
    file => JSON.stringify(file.path) === JSON.stringify(currentPath)
  );

  const handleFileDoubleClick = (file) => {
    if (file.fileUrl) {
      setPreviewFileUrl(file.fileUrl);
    } else {
      alert('파일 URL이 존재하지 않습니다.');
    }
  };

  const closePreview = () => {
    setPreviewFileUrl(null);
  };

  return (
    <div className="archive-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo"><span className="edu">Edu</span><span className="ve">'ve</span>.com</h1>
        </div>
        <div className="nav-links">
          <span className="nav-item" onClick={() => navigate('/character')}>캐릭터</span>
          <span className="nav-item" onClick={() => navigate('/chat')}>채팅</span>
          <span className="nav-item" onClick={() => navigate('/materials')}>학습자료</span>
          {username ? (
            <>
              <span className="user-name">{username}</span>
              <span className="nav-item logout-btn" onClick={handleLogout}>로그아웃</span>
            </>
          ) : (
            <>
              <span className="nav-item" onClick={() => navigate('/login')}>로그인</span>
              <span className="nav-item" onClick={() => navigate('/signup')}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      <div className="archive-header">
        <input className="archive-search" type="text" placeholder="Search" />
        <div className="archive-buttons">
          <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileSelect} />
          <button className="btn add-file" onClick={() => document.getElementById('file-upload').click()}>
            파일추가
          </button>
          <button className="btn add-folder" onClick={() => setIsAddingFolder(true)}>폴더추가</button>
        </div>
      </div>

      <div className="path-display">
        {currentPath.length === 0 ? (
          <span className="path-link">홈</span>
        ) : (
          <>
            <span className="path-link" onClick={() => setCurrentPath([])}>홈</span>
            {currentPath.map((part, idx) => (
              <span key={`${part}-${idx}`} onClick={() => handlePathClick(idx)} className="path-link">
                {' / '}{part}
              </span>
            ))}
          </>
        )}
      </div>

      <div className="folder-list">
        {displayedFolders.map(folder => (
          <div key={folder.id} className="folder-box" onClick={() => handleFolderClick(folder.name)}>
            <img src="/folder.png" alt="folder" className="folder-icon" />
            <div className="folder-name">{folder.name}</div>
          </div>
        ))}

        {isAddingFolder && (
          <div className="folder-box new-folder">
            <img src="/folder.png" alt="new folder" className="folder-icon" />
            <input
              type="text"
              className="folder-name-input"
              placeholder="이름 입력"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="file-list">
        {displayedFiles.map((file, idx) =>
          file && file.id && file.name ? (
            <div key={file.id || idx} className="file-box" onDoubleClick={() => handleFileDoubleClick(file)}>
              <img src="/pdf-thumbnail.png" alt="file icon" className="file-thumbnail" />
              <div className="file-name">{file.name}</div>
            </div>
          ) : null
        )}
      </div>

      {previewFileUrl && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={previewFileUrl}
              title="PDF 미리보기"
              width="100%"
              height="700px"
              style={{ border: 'none' }}
            />
            <button className="close-btn" onClick={closePreview}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;



