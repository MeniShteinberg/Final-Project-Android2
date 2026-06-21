'use client';
import { useState } from 'react';
import axios from 'axios';
import '../src/app/styles/AddPost.css';


export default function AddPost({ userId, groupId, onPostAdded }) {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('postedBy', userId);
      if (photo) formData.append('photo', photo);

      let url = 'http://localhost:5000/api/posts';

      if (groupId) {
        url = `http://localhost:5000/api/groups/${groupId}/post`;
      }

      const { data } = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setContent('');
      setPhoto(null);
      onPostAdded?.();
    } catch (err) {
      console.error('Post failed:', err);
    }
  };

  return (
    <form onSubmit={handlePost} className="form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea"
      />

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label htmlFor="upload" className="uploadLabel">
          <img src="/images/upload.png" alt="Upload" style={{ width: '20px', height: '20px' }} />
        </label>
        <input
          id="upload"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button type="submit" className="button">
          <img src="/images/send.png" alt="Send" style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </form>
  );
}
