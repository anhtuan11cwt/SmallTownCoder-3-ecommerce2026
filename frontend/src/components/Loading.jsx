const Loading = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
        <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-red-500" />
      </div>
    </div>
  );
};

export default Loading;
