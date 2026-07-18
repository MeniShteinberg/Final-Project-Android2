'use client';
import { useState } from 'react';
import axios from 'axios';

export default function CreateGroup({ userId, onGroupCreated }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        isPrivate: false,
    });

    const [selectedImage, setSelectedImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setSelectedImage(files[0]);
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('isPrivate', form.isPrivate);
            formData.append('userId', userId);

            if (selectedImage) {
                formData.append('photo', selectedImage);
            }

            const res = await axios.post('http://localhost:5000/api/groups/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Group created!');
            onGroupCreated(res.data);
            setForm({
                name: '',
                description: '',
                category: '',
                isPrivate: false,
            });
            setSelectedImage(null);
        } catch (err) {
            alert('Error creating group');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <h2>Create Group</h2>
            <input
                name="name"
                placeholder="Group name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />
            <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
            />
            <br />
            <label>
                Upload Group Image:
                <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </label>
            {selectedImage && (
                <div>
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        style={{ width: 120, marginTop: 10, borderRadius: 8 }}
                    />
                </div>
            )}
            <button type="submit">Create</button>
        </form>
    );
}
