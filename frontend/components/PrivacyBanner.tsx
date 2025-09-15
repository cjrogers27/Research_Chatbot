'use client';
type Props = { privacy: string };
export default function PrivacyBanner({ privacy }: Props) {
   if (privacy !== 'on') return null;
   return (
     <div className="rounded-md border p-3 text-sm bg-green-50 border-green-200">
       Privacy note: We only use what you share during this chat to suggest options. No medical advice. No PHI stored.
    </div>
   );
}
