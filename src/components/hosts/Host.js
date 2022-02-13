import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from 'react-hook-form';

import {getHost, createHost, updateHost, existHostByName} from "../../services/Hosts";

import CardActions from "@mui/material/CardActions";
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import {styled} from "@mui/material/styles";


import {Title} from "../utils/Title";
import {Loading, GetIdUser} from "../utils/LittleComponents";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    marginTop: 50
}));

/***
 * Componente formulario para (Buscar o Editar) un Host
 * @param: idHost = Si se recibe un id mayor a 0 es un host para editar, de lo contrario es un host para crear
 ***/
function Host() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {idHost} = useParams();
    const {idGroup} = useParams();
    const [existMachine, setExistMachine] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);

    const [nameTextField, setNameTextField] = useState('');

    const [id, setId] = useState(0);
    const [name_host, setNameHost] = useState('');
    const [ip, setIp] = useState('');
    const [mac, setMac] = useState('');
    const [so, setSo] = useState('');
    const [group, setGroup] = useState(null);
    const [order, setOrder] = useState(0);
    const [description, setDescription] = useState('');
    const [pool, setPool] = useState('');
    const [user, setUser] = useState('');

    let navigate = useNavigate();

    useEffect(function () {
        if (idHost > 0) {
            setExistMachine(true);
        }
        getHost_Api();
    }, [])

    // <<-- | O B T E N E R - U N - H O S T  |-->
    const getHost_Api = async () => {

        if (parseInt(idHost) > 0) {

            const hostJson = await getHost(`${idHost}`);

            setId(hostJson.id);
            setNameHost(hostJson.name_host);
            setIp(hostJson.ip);
            setMac(hostJson.mac);
            setSo(hostJson.so);
            setGroup(hostJson.group);
            setOrder(hostJson.order);
            setDescription(hostJson.description);
            setPool(hostJson.pool);
            setUser(hostJson.user);
        }

        setIsReady(true);
    }

    // <<-- | B U S C A R - M A Q U I N A - (BD EXTERNA ) |-->
    const searchByName = (nameMachine) => async () => {
        setLoading(true);
        const machine = await existHostByName(nameMachine.nameTextField);
        setIsSearch(true);

        if (machine != 'not found machine') {
            setExistMachine(true);
            setIsSearch(false);
            setLoading(false);

            setNameHost(machine.name_host);
            setIp(machine.ip);
            setMac(machine.mac);
        } else {
            setExistMachine(false);
            setIsSearch(true);
            setLoading(false);
        }

    }

    //<<--| G U A R D A R - L O S - D A T O S |-->>
    const onSubmit = (data) => {
        //e.preventDefault()
        var id = idHost > 0 ? idHost : 0;
        var groupId = idGroup !== undefined ? idGroup : null;
        var modelHost = {
            "id": id,
            name_host,
            ip,
            mac,
            so,
            "groupId": groupId,
            "order": order,
            description,
            "pool": null,
            "user": GetIdUser()
        }

        if (idHost > 0) {
            hostApi(modelHost, "update");
        } else {
            hostApi(modelHost, "create")
        }
    }

    const hostApi = async (data, method) => {
        var hostJson;

        if (method === "update") {
            hostJson = await updateHost(data);
        } else {
            hostJson = await createHost(data);
        }

        if (hostJson === "Created-OK" || hostJson === "Updated-OK") {
            navigate("/hosts")
        } else if (hostJson === undefined) {
            console.log('Error Host ->, ', hostJson);
            setIsError(true);
        }
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (TEXTFIELD) |-->>
    const handleChange = (e) => {
        setNameTextField(e.currentTarget.value)
        setIsSearch(false)
    }

    return (
        <>
            <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justify="center"
                marginTop={5}
                //justifyContent="center"
            >
                <Title title={'MÁQUINA'}/>
                <Item>
                    {
                        idHost == 0 &&
                        <Grid container
                              spacing={1}
                              marginTop={1}
                              marginBottom={1}>
                            <Grid item xs={6}>
                                <TextField
                                    id="id_nameHostTextField"
                                    name="nameHostTextField"
                                    label="Nombre de Maquina"
                                    size="small"
                                    value={nameTextField}
                                    variant="outlined"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="outlined" size="medium" startIcon={<SearchIcon/>}
                                        onClick={searchByName({nameTextField})}>
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {
                        isLoading && <Loading></Loading>
                    }
                    <Divider/>
                    {existMachine &&
                    <Grid marginTop={4} marginBottom={1}>
                        <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                            <Card sx={{minWidth: 275}}>
                                <Grid container
                                      spacing={1}>
                                    <Grid>
                                        <TextField
                                            hidden={true}
                                            id="id"
                                            name="id"
                                            label="Id"
                                            value={id}
                                            variant="outlined"
                                            type="number"
                                            className="form-control mb-4"
                                            onChange={(e) => setId(e.currentTarget.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={2}>
                                        <TextField
                                            disabled
                                            id="id_nameHost"
                                            name="nameHost"
                                            label="Nombre de Maquina"
                                            size="small"
                                            value={name_host}
                                            variant="outlined"
                                            className="form-control"
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={2}>
                                        <TextField
                                            disabled
                                            id="id_ip"
                                            name="ip"
                                            label="Ip"
                                            size="small"
                                            value={ip}
                                            variant="outlined"
                                            className="form-control"
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={2}>
                                        <TextField
                                            disabled
                                            id="id_mac"
                                            name="mac"
                                            label="Mac"
                                            size="small"
                                            value={mac}
                                            variant="outlined"
                                            className="form-control"
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={1}>
                                        <FormControl fullWidth variant="standard" sx={{m: 0, minWidth: 100}}>
                                            <InputLabel id="id-So-label">Sistema Operativo</InputLabel>
                                            <Select
                                                labelId="id-So-label"
                                                id="id_so"
                                                value={so}
                                                size="small"
                                                autoFocus
                                                error={errors.so ? true : false}
                                                {...register("so", {required: true})}//se declara antes del onChange
                                                onChange={(e) => setSo(e.target.value)}
                                            >
                                                <MenuItem value={'W'}>Windows</MenuItem>
                                                <MenuItem value={'L'}>Linux</MenuItem>
                                                <MenuItem value={'M'}>Mac</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} marginTop={2}>
                                        <TextField
                                            id="id_description"
                                            name="description"
                                            label="Descripción"
                                            size="small"
                                            multiline
                                            maxRows={2}
                                            value={description}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <CardActions>
                                    <Grid container
                                          spacing={1}
                                          marginTop={1}
                                          marginBottom={1}>
                                        <Grid item xs={6}>
                                            <Button size="small" startIcon={<CheckIcon/>} type="submit">
                                                Guardar
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button size="small" startIcon={<ClearIcon/>}
                                                    onClick={() => {
                                                        navigate(`/hosts/`)
                                                    }}>
                                                Cancelar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </Card>
                        </form>
                    </Grid>
                    }
                    {!existMachine && isSearch &&
                    <Alert severity="warning">
                        <strong>Sin resultados - </strong>
                        La siguiente máquina no se ha encontrado en el sistema
                        <br/>
                        <strong>{nameTextField}</strong>
                    </Alert>
                    }
                </Item>
            </Grid>
        </>
    );

}

export default Host;