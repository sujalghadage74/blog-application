import React, { Suspense, lazy } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill-new'));

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'align',
  'link',
];

const RichTextEditor = ({ value, onChange, placeholder = 'Write your blog content here...' }) => {
  return (
    <div className="rich-editor-wrapper">
      <Suspense fallback={<div className="editor-loading">Loading Editor...</div>}>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </Suspense>
    </div>
  );
};

export default RichTextEditor;
