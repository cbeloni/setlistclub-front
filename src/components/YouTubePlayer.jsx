import ReactPlayer from "react-player";

export default function YouTubePlayer({ url }) {
  if (!url) {
    return <p className="panel p-4 text-sm text-black/65">Nenhum video vinculado para esta cifra.</p>;
  }

  return (
    <div className="panel mb-5 overflow-hidden p-2">
      <div className="aspect-video w-full rounded-xl">
        <ReactPlayer url={url} controls width="100%" height="100%" />
      </div>
    </div>
  );
}
