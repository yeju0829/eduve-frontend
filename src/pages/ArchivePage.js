// ArchivePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArchivePage.css';

const ArchivePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      color: '#1B512D',
      path: [...currentPath],
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const handleFolderClick = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const handlePathClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        path: [...currentPath],
        thumbnail: reader.result,
      };
      setFiles((prev) => [...prev, newFile]);
    };

    reader.readAsDataURL(selectedFile);
  };

  const displayedFolders = folders.filter(
    (folder) => JSON.stringify(folder.path) === JSON.stringify(currentPath)
  );

  const displayedFiles = files.filter(
    (file) => JSON.stringify(file.path) === JSON.stringify(currentPath)
  );

  return (
    <div className="archive-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">
            <span className="edu">Edu</span><span className="ve">'ve</span>.com
          </h1>
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
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
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
              <span key={idx} onClick={() => handlePathClick(idx)} className="path-link">
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
        {displayedFiles.map(file => (
          <div key={file.id} className="file-box">
            <img src={file.thumbnail} alt={file.name} className="file-thumbnail" />
            <div className="file-name">{file.name}</div>
          </div>
        ))}
      </div>

      {displayedFolders.length === 0 && displayedFiles.length === 0 && !isAddingFolder && (
        <div className="empty-message">아직 생성된 폴더나 파일이 없습니다.</div>
      )}
    </div>
  );
};

export default ArchivePage;

