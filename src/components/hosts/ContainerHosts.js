import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListIcon from '@mui/icons-material/List';
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import Groups from "../groups/Groups";
import Hosts from "./Hosts";
import {getHosts} from "../../services/Hosts";
import {Title, SubTitle} from "../utils/Title";

/***
 * Componente (principal contenedor) que muestra los componentes (Hosts y Groups)
 ***/
function ContainerHosts() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    let navigate = useNavigate();
    const [hosts, setHosts] = useState([]); //Hosts sin grupo
    const [hostGroups, setHostGroup] = useState([]); //Hosts Con grupo

    useEffect(function () {
        getHosts_Api();
    }, [])

    //Obtener los ContainerHosts de la API
    const getHosts_Api = async () => {
        const hostsJson = await getHosts();

        //Ordenamos ascendentemente por grupo
        var resultHost = hostsJson.results.sort(function (a, b) {
            return (a.group - b.group)
        })

        //Recorremos los host y los agrupamos si pertenecen a un grupo
        resultHost.forEach(host => {
            if (host.group !== null) {
                if (!hostGroups.hasOwnProperty(host.group.id)) {
                    hostGroups[host.group.id] = {
                        idGroup: host.group.id,
                        nameGroup: host.group.name_group,
                        hosts: []
                    }
                }

                hostGroups[host.group.id].hosts.push({
                    id: host.id,
                    name_host: host.name_host,
                    ip: host.ip,
                    mac: host.mac,
                    so: host.so,
                    group: host.group.id,
                    order: host.order,
                    description: host.description,
                    pool: host.pool,
                    user: host.user
                })
            }
        })

        /* var index = 1
         hostGroups.forEach(group => {
             group.idGroup = index
             index++
         })*/

        setHostGroup(hostGroups.filter(el => el != null))

        //Filtramos solo los host que no estan en ningun grupo
        setHosts(resultHost.filter(el => el.group === null));
    }


    //F U N C I O N E S - D E - E L - B O T O N - D E - O P C I O N E S
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        if (event.currentTarget.id === 'createMachine') {
            navigate(`/host/${0}`)
        }
        if (event.currentTarget.id === 'newGroup') {
            navigate(`/group/${0}`)
        }
    };

    // Estilos del boton para que se quede fijo por toda la pagina
    const fabStyle = {
        position: 'fixed',
        bottom: 20,
        right: 20,
    };

    return (
        <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              marginTop={5}
              style={{minHeight: '100vh'}}>
            <Title title={'MÁQUINAS'}/>

            <SubTitle title={'Máquinas sin orden de apagado'}/>
            <Hosts
                //Enviamos el estado (setHost) a este componente hijo para que lo actualice
                hosts={hosts}
                setHosts={setHosts}
            />

            <SubTitle title={'Grupos con orden de apagado'}/>
            {hostGroups.map((value, index) => (
                <Groups
                    group={value}
                    key={`group-${index}`}
                    hostGroups={hostGroups}
                    // Se envia lista de hosts sin grupo para actualizarla cuando se borre un grupo
                    hosts={hosts}
                    setHosts={setHosts}
                />
            ))}
            <Fab id="demo-positioned-button"
                 aria-controls={open ? 'demo-positioned-menu' : undefined}
                 aria-haspopup="true"
                 aria-expanded={open ? 'true' : undefined}
                 color="primary"
                 aria-label="add"
                 onClick={handleClick}
                 sx={fabStyle}>
                <ListIcon/>
            </Fab>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem id="createMachine" onClick={handleClose}>Alta Maquina</MenuItem>
                <MenuItem id="newGroup" onClick={handleClose}>Nuevo Grupo</MenuItem>
            </Menu>
        </Grid>

    );

}

export default ContainerHosts