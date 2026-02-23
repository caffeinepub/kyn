import { useState } from 'react';
import { useCreatePost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatePostForm() {
  const [content, setContent] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }

    try {
      await createPost.mutateAsync(content);
      setContent('');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      if (error instanceof Error && error.message.includes('must be registered')) {
        toast.error('Please register a username first');
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share with Your Community</CardTitle>
        <CardDescription>What's happening in your neighborhood?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Post</Label>
            <Textarea
              id="content"
              placeholder="Share news, events, or information about your community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{content.length} characters</p>
          </div>
          <Button type="submit" disabled={createPost.isPending || !content.trim()} className="w-full">
            {createPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post to Community'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
