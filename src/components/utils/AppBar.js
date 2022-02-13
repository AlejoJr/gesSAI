import React, {useState, useEffect} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {NavLink, Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {createTheme} from '@mui/material/styles';
import {amber, grey, blueGrey, deepOrange, lightGreen, teal} from "@material-ui/core/colors";
import {ListItemIcon} from "@material-ui/core";
import LogoutIcon from '@mui/icons-material/Logout';

import {GetUsername} from "./LittleComponents";


const pages = [
    {'page': 'hosts', 'namePage': 'Máquinas'},
    {'page': 'pools', 'namePage': 'Virtualización'},
    {'page': 'vms', 'namePage': 'Máquinas virtuales'}
];
const settings = ['Logout'];

const ResponsiveAppBar = (props) => {

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const [userLogin, setUserLogin] = useState();

    let navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (key) => {
        setAnchorElNav(null);
    }

    const handleSessionUser = (key) => {

        if (key.currentTarget.id === 'Logout') {
            window.localStorage.clear(); //clear all localstorage
            window.localStorage.removeItem("token"); //remove one item
            window.location.replace(''); // refresh page
        }
        setAnchorElNav(null);
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const theme = createTheme({

        palette: {
            primary: amber,
            secondary: {
                main: '#8bc34a',
            },
            background: {
                default: '#fdcdd4',
            },
        },
    });

    useEffect(function () {
        setUserLogin(GetUsername);
    }, [])

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}
                        >
                            GES-SAI
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page.namePage}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}
                        >
                            LOGOcaicedo
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {pages.map((page) => (
                                <NavLink key={page.page}
                                         to={page.page}
                                         className={({isActive}) => isActive ? 'bg-secondary' : ""}
                                         style={{textDecoration: 'none'}}
                                >
                                    <Button

                                        onClick={handleCloseNavMenu}
                                        sx={{my: 2, color: 'white', display: 'block'}}
                                    >
                                        {page.namePage}
                                    </Button>
                                </NavLink>
                            ))}
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar sx={{width: 45, height: 45}}>
                                        <AccountCircleIcon color="primary" sx={{fontSize: 45}}/>
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Typography textAlign="center">{userLogin}</Typography>
                                <Divider/>
                                {settings.map((setting) => (
                                    <MenuItem key={setting} id={setting} onClick={handleSessionUser}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small"/>
                                        </ListItemIcon>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}

                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {
                //Se muestra el contenido que envuelve esta RUTA
                <Outlet/>
            }
        </>
    );
};

export default ResponsiveAppBar;
