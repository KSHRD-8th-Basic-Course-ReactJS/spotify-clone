import { getSession } from 'next-auth/react';
import Center from '../components/Center'
import Player from '../components/Player';
import Sidebar from '../components/Sidebar'

export default function Home({ session }) {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        {/* Sidebar */}
        <Sidebar />
        {/* Center */}
        <Center />
      </main>
      <div className='sticky bottom-0'>
        {/* Player */}
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    }
  }
}