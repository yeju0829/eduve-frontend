// src/pages/ArchivePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/fileApi';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import './ArchivePage.css';

const ArchivePage = () => {
  const navigate = useNavigate();

  // 네비게이션 유저 메뉴
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // 추가 드롭다운, 사이드바 상태
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchText, setSearchText] = useState('');

  // 폴더/파일 관리
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);

  // 초기 로드: 사용자명, 로컬스토리지에서 폴더·파일 불러오기
  useEffect(() => {
    const u = localStorage.getItem('username');
    if (u) setUsername(u);

    const sf = localStorage.getItem('folders');
    if (sf) {
      try { setFolders(JSON.parse(sf)); }
      catch { localStorage.removeItem('folders'); }
    }

    const sF = localStorage.getItem('files');
    if (sF) {
      try { setFiles(JSON.parse(sF)); }
      catch { localStorage.removeItem('files'); }
    }
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  // 새 폴더 추가
  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    const nf = {
      id: uuidv4(),
      name: newFolderName.trim(),
      color: '#1B512D',
      path: [...currentPath]
    };
    setFolders(prev => {
      const up = [...prev, nf];
      localStorage.setItem('folders', JSON.stringify(up));
      return up;
    });
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  // 파일 업로드
  const handleFileSelect = async e => {
    const file = e.target.files[0];
    if (!file) return;
    let uid;
    try { uid = jwtDecode(localStorage.getItem('token')).userId; }
    catch {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('userId', uid);
    fd.append('folderId', 1);

    try {
      const res = await uploadFile(fd);
      const { fileInfo } = res.data;
      const nf = {
        id: uuidv4(),
        name: fileInfo.fileName,
        path: [...currentPath],
        fileUrl: fileInfo.fileUrl,
        type: fileInfo.fileType
      };
      setFiles(prev => {
        const up = [...prev, nf];
        localStorage.setItem('files', JSON.stringify(up));
        return up;
      });
    } catch (err) {
      console.error(err);
      alert('파일 업로드에 실패했습니다.');
    }
  };

  // 경로 이동 핸들러
  const handleFolderClick = name => setCurrentPath(p => [...p, name]);
  const handlePathClick = idx => setCurrentPath(p => p.slice(0, idx + 1));

  // PDF 미리보기 핸들러
  const handleFileDoubleClick = file =>
    file.fileUrl
      ? setPreviewFileUrl(file.fileUrl)
      : alert('파일 URL이 없습니다.');
  const closePreview = () => setPreviewFileUrl(null);

  // 재귀 폴더 트리 렌더링 (폴더 + 파일)
  const renderTree = (path = []) => {
    const subFolders = folders.filter(f => JSON.stringify(f.path) === JSON.stringify(path));
    const subFiles   = files.filter(f => JSON.stringify(f.path) === JSON.stringify(path));

    if (!subFolders.length && !subFiles.length) return null;

    return (
      <ul>
        {subFolders.map(f => (
          <li
            key={f.id}
            className="folder-node"
            onClick={() => handleFolderClick(f.name)}
          >
            <img src="/mini_folder.png" alt="folder" className="sidebar-icon" />
            {f.name}
            {renderTree([...path, f.name])}
          </li>
        ))}

        {subFiles.map(file => (
          <li
            key={file.id}
            className="file-node"
            onClick={() => handleFileDoubleClick(file)}
          >
            <img src="/mini_file.png" alt="file" className="sidebar-icon" />
            {file.name}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="archive-container">
      {/* 상단 네비게이션 바 */}
      <nav className="navbar">
        <h1 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="edu">Edu</span>
          <span className="ve">'ve</span>
          <span className="com">.com</span>
        </h1>
        <div className="nav-links">
          <span className="nav-item" onClick={() => navigate('/character')}>캐릭터</span>
          <span className="nav-item" onClick={() => navigate('/chat')}>채팅</span>
          <span className="nav-item" onClick={() => navigate('/materials')}>학습자료</span>
          {username ? (
            <div className="user-menu">
              <button className="user-button" onClick={() => setMenuOpen(o => !o)}>
                {username} <span className="arrow">▼</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <button onClick={() => navigate('/settings')}>⚙️ 설정</button>
                  <button onClick={handleLogout}>🚪 로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span className="nav-item" onClick={() => navigate('/login')}>로그인</span>
              <span className="nav-item" onClick={() => navigate('/signup')}>회원가입</span>
            </>
          )}
        </div>
      </nav>

      {/* 본문: 사이드바 + 메인 */}
      <div className="archive-body">
        {/* 사이드바 */}
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="search-wrapper">
            <input
              className="archive-search"
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            {sidebarOpen && (
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(false)}
              >
                &lt;&lt;
              </button>
            )}
          </div>
          <div className="folder-tree">
            {renderTree([])}
          </div>
        </aside>

        {/* 메인 영역 */}
        <main className="archive-main">
          {!sidebarOpen && (
            <button
              className="sidebar-toggle main-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              &gt;&gt;
            </button>
          )}

          {/* 경로 표시 */}
          <div className="path-display">
            {currentPath.length === 0 ? (
              <span className="path-link">홈</span>
            ) : (
              <>
                <span className="path-link" onClick={() => handlePathClick(-1)}>홈</span>
                {currentPath.map((p, i) => (
                  <span
                    key={p + i}
                    className="path-link"
                    onClick={() => handlePathClick(i)}
                  >
                    {' / '}{p}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* add 버튼 + 폴더 리스트 */}
          <div className="action-and-folders">
            <div className="add-container">
              <button className="add-toggle" onClick={() => setAddMenuOpen(o => !o)}>
                <img src="/add.png" alt="추가" className="add-icon" />
              </button>
              {addMenuOpen && (
                <div className="add-dropdown">
                  <button onClick={() => {
                    document.getElementById('file-upload').click();
                    setAddMenuOpen(false);
                  }}>파일추가</button>
                  <button onClick={() => {
                    setIsAddingFolder(true);
                    setAddMenuOpen(false);
                  }}>폴더추가</button>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            <div className="folder-list">
              {isAddingFolder && (
                <div className="folder-box new-folder">
                  <img src="/folder.png" className="folder-icon" alt="new folder" />
                  <input
                    className="folder-name-input"
                    placeholder="이름 입력"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddFolder()}
                    autoFocus
                  />
                </div>
              )}
              {folders
                .filter(f => JSON.stringify(f.path) === JSON.stringify(currentPath))
                .map(f => (
                  <div
                    key={f.id}
                    className="folder-box"
                    onClick={() => handleFolderClick(f.name)}
                  >
                    <img src="/folder.png" className="folder-icon" alt="folder" />
                    <div className="folder-name">{f.name}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* 파일 리스트 */}
          <div className="file-list">
            {files
              .filter(f => JSON.stringify(f.path) === JSON.stringify(currentPath))
              .map(file => (
                <div
                  key={file.id}
                  className="file-box"
                  onDoubleClick={() => handleFileDoubleClick(file)}
                >
                  <img src="/pdf-thumbnail.png" className="file-thumbnail" alt="file" />
                  <div className="file-name">{file.name}</div>
                </div>
              ))}
          </div>

          {/* PDF 미리보기 모달 */}
          {previewFileUrl && (
            <div className="modal-overlay" onClick={closePreview}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <iframe
                  src={previewFileUrl}
                  title="PDF 미리보기"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
                <button className="close-btn" onClick={closePreview}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArchivePage;
