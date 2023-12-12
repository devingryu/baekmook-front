import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
} from "@mui/material";
import { sanitize } from "isomorphic-dompurify";
import Gravatar from "react-gravatar";
import { type Post } from "~/apis/post";
import { useTypographyStyles } from "~/utils/util";

interface PostCardProps {
  post: Post;
  onClick?: (post: Post) => void;
}

const PostCard = ({ post, onClick }: PostCardProps) => {
  const quillStyle = useTypographyStyles();

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardActionArea disabled={!onClick} onClick={() => onClick?.(post)}>
        <CardHeader
          avatar={
            <Gravatar
              style={{ borderRadius: "50%" }}
              size={36}
              email={post.registerer.email}
            />
          }
          title={post.title}
          titleTypographyProps={{ variant: "body1", fontWeight: "bold" }}
          subheader={`${post.registerer.name}${post.lecture ? ` [${post.lecture.name}]`: ''} ⋅ ${post.creationTimeFormatted}`}
        />
        <CardContent sx={{ pt: 0 }}>
          <Box
            sx={{ ...quillStyle }}
            dangerouslySetInnerHTML={{
              __html: sanitize(post.content),
            }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PostCard;
