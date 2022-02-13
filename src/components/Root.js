import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";


import Home from "./utils/Home";
import ContainerVms from "./virtualMachines/ContainerVms";
//import Pools from "../testComponents/Pools";
//import Pool from "../testComponents/Pool";
import Pool from "../components/pools/Pools"
import ContainerHosts from "./hosts/ContainerHosts";
import Host from "./hosts/Host";
import Group from "./groups/Group";

import ResponsiveAppBar from "./utils/AppBar";
import NotFoundPage from "./utils/NotFoundPage";
import SignIn from "./SignIn";
import useToken from "../customHooks/useToken";
import ContainerPools from "./pools/ContainerPools"; // <<-- Hook Personalizado -->>

function Root() {

     // <<-- | G U A R D A R - E L - T O K E N - E N - L A - S E S S I O N  ( E N  - U N - H O O K)  |-->
    const { token, setToken} = useToken();

    if (!token) {
        return <SignIn setToken={setToken}/>
    }
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ResponsiveAppBar/>}>
                        <Route index element={<Home/>}/>
                        <Route path="hosts" element={<ContainerHosts/>}/>
                        <Route path="host/:idHost" element={<Host/>}/>
                        <Route path="host/:idHost/group/:idGroup" element={<Host/>}/>
                        <Route path="vms" element={<ContainerVms/>}/>
                        <Route path="pools" element={<ContainerPools/>}/>
                        <Route path="pool/:idPool" element={<Pool/>}/>
                        <Route path="pool/:idPool/group/:idGroup" element={<Pool/>}/>
                        <Route path="group/:idGroup" element={<Group/>}/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Root