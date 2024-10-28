import { useState, useEffect } from 'react';
import VideoRecorder from '../components/VideoRecorder';

interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
}

export default function UserFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    // Fetch posts from your backend
    // This is a mock implementation
    setPosts([
      {
        id: '1',
        title: 'First Challenge',
        content: 'Record your best dance move!',
      },
      {
        id: '2',
        title: 'Singing Contest',
        content: 'Show us your vocal skills!',
      },
    ]);
  }, []);

  const handleRecordingComplete = async (blob: Blob) => {
    // Here you would upload the blob to your storage solution
    console.log('Recording completed, size:', blob.size);
    setShowRecorder(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Content Feed</h1>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <button
              onClick={() => {
                setSelectedPost(post);
                setShowRecorder(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Respond with Video
            </button>
          </div>
        ))}
      </div>

      {showRecorder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Recording response for: {selectedPost?.title}
            </h3>
            <VideoRecorder onRecordingComplete={handleRecordingComplete} />
            <button
              onClick={() => setShowRecorder(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}