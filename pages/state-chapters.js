import Head from 'next/head';
import dynamic from 'next/dynamic';

// MapLibre needs the browser, so the map only renders client-side
const StateChaptersMap = dynamic(() => import('../components/map/StateChaptersMap'), {
  ssr: false,
  loading: () => <div style={{ position: 'fixed', inset: 0 }} />,
});

// Existing Arewa19 members before the website registration form
const MEMBER_BASELINE = 112000;

const northernStates = [
  { name: 'Adamawa', capital: 'Yola', zone: 'North-East' },
  { name: 'Bauchi', capital: 'Bauchi', zone: 'North-East' },
  { name: 'Borno', capital: 'Maiduguri', zone: 'North-East' },
  { name: 'Gombe', capital: 'Gombe', zone: 'North-East' },
  { name: 'Taraba', capital: 'Jalingo', zone: 'North-East' },
  { name: 'Yobe', capital: 'Damaturu', zone: 'North-East' },
  { name: 'Benue', capital: 'Makurdi', zone: 'North-Central' },
  { name: 'Kogi', capital: 'Lokoja', zone: 'North-Central' },
  { name: 'Kwara', capital: 'Ilorin', zone: 'North-Central' },
  { name: 'Nasarawa', capital: 'Lafia', zone: 'North-Central' },
  { name: 'Niger', capital: 'Minna', zone: 'North-Central' },
  { name: 'Plateau', capital: 'Jos', zone: 'North-Central' },
  { name: 'FCT', capital: 'Abuja', zone: 'North-Central' },
  { name: 'Jigawa', capital: 'Dutse', zone: 'North-West' },
  { name: 'Kaduna', capital: 'Kaduna', zone: 'North-West' },
  { name: 'Kano', capital: 'Kano', zone: 'North-West' },
  { name: 'Katsina', capital: 'Katsina', zone: 'North-West' },
  { name: 'Kebbi', capital: 'Birnin Kebbi', zone: 'North-West' },
  { name: 'Sokoto', capital: 'Sokoto', zone: 'North-West' },
  { name: 'Zamfara', capital: 'Gusau', zone: 'North-West' }
];

export default function StateChapters() {
  return (
    <>
      <Head>
        <title>State Chapters - Arewa19 Pyramid</title>
        <meta name="description" content="A19 operates across all 19 Northern states through community cells connecting local action to digital innovation" />
      </Head>

      {/* Demo for the movement: its existing membership, with the form's registrations added live on top */}
      <StateChaptersMap chapters={northernStates} memberBaseline={MEMBER_BASELINE} />
    </>
  );
}
