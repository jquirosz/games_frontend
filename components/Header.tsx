import {useAuth} from "react-oidc-context";
import {useState} from "react";
import {User} from "oidc-client-ts";
import {Game} from "../app/page";

export function Header(props: { setUserGameDetails: (arg0: Game[]) => void; setUserGames: (arg0: number[]) => void; }) {
    const base_url = process.env.NEXT_PUBLIC_SERVICE_HOST;

    const auth = useAuth();
    const [creatingUser, setCreatingUser] = useState(false);
    const [userData, setUserData] = useState<User | null | undefined>(null);

    const createUser = () => {
        const url = `${base_url}/users/`;
        const headers = new Headers({'Content-Type': 'application/json'});
        const data = {
            email: auth.user?.profile.email,
            name: auth.user?.profile.name || "",
            id: auth.user?.profile.sub
        }
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCreatingUser(false);
            });
    }

    const loadUser = async () => {
        fetch(`${base_url}/users/${auth.user?.profile.sub}`)
            .then((response) => {
                    return response.json();
                }
            ).then((data) => {
            if (data == null && !creatingUser) {
                setCreatingUser(true);
                createUser();
                console.log("user not found");
            } else {
                props.setUserGameDetails(data.gameDetails);
                props.setUserGames(data.games);
            }

        }).catch((fetchError) => {
            console.error(fetchError);
        });
    }

    const checkLogin = () => {
        if (auth.isLoading) {
            return <div>Loading...</div>;
        } else {
            if (auth.isAuthenticated) {
                setUserData(auth.user)
                loadUser();
            } else {
                auth.signinRedirect();
            }
        }
    }
    if (userData == null) {
        checkLogin();
    }


    const login = () => {
        if (!auth.isAuthenticated) {
            return <button onClick={() => auth.signinRedirect()}>Sign in</button>
        } else {
            return <><p>Welcome {auth.user?.profile.email} </p>
            <button onClick={() => {auth.removeUser();auth.signinRedirect();}}>Sign out</button>
</>
        }
    }


    return <div className="text-right max-w-full p-5 mx-auto">
        {login()}
    </div>
}