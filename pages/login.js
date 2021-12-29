import { getProviders, signIn } from 'next-auth/react'

function Login({ providers }) {
    return (
        <div>
            {Object.values(providers)?.map(provider => (
                <div key={provider.name}>
                    <button
                        className='bg-[#18D860] text-white p-5 rounded-full'
                        onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Login;

export async function getServerSideProps(context) {
    const providers = await getProviders();
    return {
        props: {
            providers,
        }
    }
}