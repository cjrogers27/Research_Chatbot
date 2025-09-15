// frontend/components/avatar.tsx
'use client';

type Props = { privacy: string };

export default function Avatar({ privacy }: Props) {
  // Use a static image sitting in /public
  // You can change the filename below if you prefer JPG, etc.
  const src = '/avatar.png';

  return (
    <div className="flex items-center gap-2">
      <img
        src={src}
        alt="Chatbot avatar"
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => {
          // graceful fallback if the image is missing
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'w-12 h-12 rounded-full bg-gray-200';
          e.currentTarget.parentElement?.prepend(fallback);
        }}
      />
      {privacy === 'on' && (
        <span className="text-sm text-gray-600">Privacy-aware</span>
      )}
    </div>
  );
}
