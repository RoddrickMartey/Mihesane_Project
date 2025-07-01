import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import TagInput from "@/components/ui/TagInput";
import CategorySelector from "@/components/ui/CategorySelector";
import Modal from "@/components/ui/Modal";
import InfoBox from "@/components/ui/InfoBox";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import Spinner from "@/components/ui/Spinner";
import AvatarPicker from "@/components/ui/AvatarPicker";
import ImageSelector from "@/components/ui/ImageSelector";
import { Moon, Save, Sun, CheckCircle, Book } from "lucide-react";
import image from "@/assets/images/default.png";

function TestPage() {
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [blogImage, setBlogImage] = useState(null);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    setAvatarUrl(image);
    return () => clearTimeout(timer);
  }, []);

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleBlogImageSelect = (file) => {
    setBlogImage(file);
  };

  const handleSubmit = () => {
    setModalOpen(false);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-heading">Create Blog Post</h1>
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          icon={darkMode ? <Moon /> : <Sun />}
          iconPosition="right"
        >
          {darkMode ? "Light" : "Dark"}
        </Button>
      </header>

      {loading ? (
        <section className="space-y-4 max-w-xl mx-auto">
          <SkeletonLoader className="w-full h-12 rounded-lg" />
          <SkeletonLoader className="w-full h-32 rounded-lg" />
          <SkeletonLoader className="w-full h-12 rounded-lg" />
          <SkeletonLoader className="w-full h-20 rounded-lg" />
        </section>
      ) : (
        <>
          <section className="space-y-4 max-w-xl mx-auto">
            <AvatarPicker imageUrl={avatarUrl} onChange={handleAvatarChange} />

            <ImageSelector
              label="Post Image"
              onSelect={handleBlogImageSelect}
            />

            <Input
              label="Title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Content"
              placeholder="Write something amazing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <TagInput label="Tags" value={tags} onChange={setTags} />
            <CategorySelector value={category} onChange={setCategory} />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="primary"
                iconPosition="left"
                icon={<Save size={20} />}
                onClick={() => setModalOpen(true)}
              >
                Publish
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <InfoBox label="Estimated Read Time" value="3 min" />
            <InfoBox label="Words" value="543" />
          </section>

          <section className="pt-10 space-y-4">
            <h2 className="text-xl font-heading">Loading State</h2>
            {submitting ? (
              <Spinner size="biiiiig" className="mx-auto" />
            ) : submitted ? (
              <div className="space-y-2 text-center">
                <CheckCircle className="text-green-500 mx-auto" size={48} />
                <h3 className="text-xl font-semibold">Submission Complete</h3>
                <p>Title: {title}</p>
                <p>Content: {content}</p>
                <p>Category: {category}</p>
                <p>Tags: {tags.join(", ")}</p>
              </div>
            ) : null}
          </section>
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-heading mb-4">Post Preview</h3>
        <p className="text-text-soft mb-4">
          This is where the post preview would be shown. You can display a
          rendered Markdown or section preview here.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            Confirm Publish
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default TestPage;
