import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {confirmAlert} from "react-confirm-alert";

import {deleteHost, hostsByGroup, updateHost} from "../../services/Hosts";
import {deleteGroup} from "../../services/Groups";
import {GetIdUser} from "../utils/LittleComponents";
import Tooltip from "@mui/material/Tooltip";

/***
 * Componente que lista los Hosts con grupo
 * @param: props = Grupo que contiene los host
 ***/
function Groups(props) {

    let navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    //<<-- | O R D E N A M O S - A S C E N D E N T E M E N T E - (G R U P O)  |-->
    var listHost = props.group.hosts.sort(function (a, b) {
        return (a.order - b.order)
    })

    // <<-- | E L I M I N A R - U N A - M Á Q U I N A  |-->
    const delete_machine = (host) => () => {
        confirmAlert({
            title: 'Borrar Maquina',
            message: 'Esta seguro de borrar la Maquina: ' + host.name_host,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        host.groupId = null;
                        host.order = 0;
                        var iElem;
                        var iHost;

                        // <<- 1). Recorremos los grupos para encontrar y eliminar la maquina seleccionada ->>
                        props.hostGroups.map(function (element, index) {
                            var indexElement = index;
                            element.hosts.map(function (objHost, index) {
                                var indexHost = index;
                                if (objHost === host) {
                                    iElem = indexElement;
                                    iHost = indexHost;
                                    deleteHost(host.id);
                                }
                            });
                        });

                        // <<- 2). Eliminamos el host del grupo y actualizamos el estado de los grupos ->>
                        props.hostGroups[iElem].hosts.splice(iHost, 1);

                        // <<- 3). Si ya no existen maquinas en el grupo, eliminamos el grupo ->>
                        if (props.hostGroups[iElem].hosts.length === 0) {
                            deleteGroup(props.hostGroups[iElem].idGroup);
                            props.hostGroups.splice(iElem, 1);
                        }

                        navigate('/hosts');

                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | E L I M I N A R - E L - G R U P O - Y - A C T U A L I Z A R - S U S - M Á Q U I N A S |-->
    const delete_group = (group) => async () => {

        // Obtenemos todos los hosts del grupo
        const response = await hostsByGroup(group.idGroup);
        confirmAlert({
            title: 'Borrar Grupo',
            message: 'Esta seguro de borrar el Grupo: ' + group.nameGroup,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        var iElem;

                        // <<- 1). Actualizamos los hosts para que no pertenezcan a un grupo ->>
                        response.hosts.map(function (host) {
                            delete host.group_id;
                            delete host.user_id;
                            host.user = GetIdUser();

                            host.groupId = null;
                            host.order = 0;

                            updateHost(host);
                            props.hosts.push(host);//<-- lista de (hosts) sin grupo del (componente padre)
                        });

                        //<<- 2). Actualizamos el Estado (hosts) del componente Padre (ContainerHosts) ->>
                        props.setHosts(props.hosts);

                        // <<- 3). Eliminamos el Grupo ->>
                        deleteGroup(group.idGroup);

                        props.hostGroups.map(function (element, index) {
                            if (element.idGroup === group.idGroup) {
                                iElem = index;
                            }
                        });
                        props.hostGroups.splice(iElem, 1);

                        navigate('/hosts');
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | E L I M I N A R - E L - G R U P O - Y - S U S - M Á Q U I N A S |-->
    /*const delete_group = (group) => async () => {

        // Obtenemos todos los hosts del grupo
        const response = await hostsByGroup(group.idGroup);
        confirmAlert({
            title: 'Borrar Grupo',
            message: 'Esta seguro de borrar el Grupo: ' + group.nameGroup + '. Se eliminará junto con sus Máquinas',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {

                        // <<- 1). Eliminamos de la Base de datos los hosts del grupo->>
                        response.hosts.map(function (host) {
                            deleteHost(host.id);
                        });

                        // <<- 2). Eliminamos el Grupo->>
                        deleteGroup(group.idGroup);

                        navigate('/hosts');
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }*/


    // <<-- | F O R M A T E A R - S T R I N G - (S I S T E M A - O P E R A T I V O)  |-->
    const OperatingSystem = ((value) => {
        if (value.so === 'W') {
            return <a> Windows</a>;
        } else if (value.so === 'L') {
            return <a> Linux</a>;
        } else if (value.so === 'M') {
            return <a> Mac</a>;
        } else {
            return <a> --</a>;
        }
    });

    // <<-- | A C O R D I O N - H O S T  |-->
    const ItemHost = ((value) => {
        return (
            <Accordion expanded={expanded === value.host.name_host} onChange={handleChange(value.host.name_host)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.host.name_host}
                    id={value.host.id}
                >
                    <Typography variant="subtitle1">{value.host.name_host}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="button" component="div">
                        <strong>Ip:</strong> {value.host.ip} <br/>
                        <strong>Mac:</strong> {value.host.mac} <br/>
                        <strong>Sitema Operativo:</strong>{<OperatingSystem so={value.host.so}/>}<br/>
                        <strong>Descripción:</strong> {value.host.description}
                    </Typography>
                    <Tooltip title="Editar Máquina">
                        <IconButton aria-label="edit-machine-group" color="primary"
                                    onClick={() => {
                                        navigate(`/host/${value.host.id}/group/${value.host.group}`)
                                    }}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Máquina">
                        <IconButton aria-label="delete-machine-group" color="primary"
                                    onClick={delete_machine(value.host)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </AccordionDetails>
            </Accordion>
        );
    });
    const tab = <>&nbsp;&nbsp;&nbsp;&nbsp;</>;
    return (
        <>
            <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  marginTop={2}>
                <Card sx={{minWidth: '97%'}}
                    /*onMouseMove={(e) => {
                        console.log('si pasa aca ')
                    }}*/>
                    <Typography variant="h6">
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography variant="button">
                                    {tab}<strong>{props.group.nameGroup}</strong>
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Tooltip title="Editar Grupo">
                                    <IconButton aria-label="edit-group" color="primary"
                                                onClick={() => {
                                                    navigate(`/group/${props.group.idGroup}`)
                                                }}>
                                        <EditIcon/>

                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar Grupo">
                                    <IconButton aria-label="delete-group" color="primary"
                                                onClick={delete_group(props.group)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Typography>

                    <CardContent>
                        {listHost.map((value, index) => (
                            <ItemHost host={value} key={`group-${index}`} index={index}/>
                        ))}
                    </CardContent>
                    {/*<CardActions>
                    <Button size="small">Alta Maquina</Button>
                </CardActions>*/}
                </Card>
            </Grid>
        </>
    )

}

export default Groups