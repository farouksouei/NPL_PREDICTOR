import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Switch,
    FormControlLabel,
    Grid, Box
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import MenuIcon from '@mui/icons-material/Menu';
import BH_BANK from './assets/bh-bank-new-rouge.jpg'; // replace with the actual path
import images from './assets/images.png'; // replace with the actual path

const App = () => {
    const initialVariables = {
        RCCC: 0.7,
        TAI: 0.126031599191762,
        ROA: 0.0103,
        SP: 1,
        INF: 0.0366,
        CHOM: 0.1329,
        TMM: 0.043,
        PIB: 0.031,
        CHOC: 0,
        ROE: 0.1295,
        CAPITAUX_PROPRES: 411,
    };

    const [variables, setVariables] = useState(initialVariables);
    const [npl, setNPL] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVariables({
            ...variables,
            [name]: parseFloat(value),
        });
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setVariables({
            ...variables,
            [name]: checked ? 1 : 0,
        });
    };

    const calculateNPL = () => {
        const {
            RCCC, TAI, ROA, SP, INF, CHOM, TMM, PIB, CHOC, ROE, CAPITAUX_PROPRES
        } = variables;
        const y = 0.32608 + -0.20710 * RCCC + -0.14360 * TAI + -1.66071 * ROA + 0.06852 * SP + -0.18319 *  INF + -0.31256 * CHOM + 0.41417 * TMM + -0.00447 * PIB + -0.00123 * CHOC + -0.02130 * ROE + -0.00002 * CAPITAUX_PROPRES;
        setNPL(y);
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const chartOptions = {
        title: {
            text: 'NPL Value Prediction',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                return `NPL: ${params[0].value.toFixed(2)}`;
            },
        },
        legend: {
            data: ['NPL'],
        },
        xAxis: {
            type: 'category',
            data: ['NPL'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'NPL',
                data: [npl],
                type: 'bar',
                barWidth: '50px', // Set the width of the bar
            },
        ],
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#000033' }}> {/* Night blue color */}
                <Toolbar>
                    <img src={BH_BANK} alt="BH_BANK logo" height="50px" style={{margin:5}}/> {/* Adjust size as needed */}
                    <Box display="flex" justifyContent="center" flexGrow={1}>
                        <Typography variant="h6" component="div">
                            NPL Predictor
                        </Typography>
                    </Box>
                    <img src={images} alt="images logo" height="50px" /> {/* Adjust size as needed */}
                    <IconButton edge="end" color="inherit" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                <Container>
                    {Object.keys(variables).map((key) => (
                        key === 'CHOC' || key === 'SP' ? (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Switch
                                        checked={variables[key] === 1}
                                        onChange={handleSwitchChange}
                                        name={key}
                                        color="primary"
                                    />
                                }
                                label={key}
                            />
                        ) : (
                            <TextField
                                key={key}
                                label={key}
                                name={key}
                                type="number"
                                onChange={handleChange}
                                margin="normal"
                                fullWidth
                                defaultValue={variables[key]}
                            />
                        )
                    ))}
                    <Button variant="contained" color="primary" onClick={calculateNPL}>
                        Calculate NPL
                    </Button>
                </Container>
            </Drawer>
            {npl !== null && (
                <div style={{ margin:50 }}>
                    <ReactECharts option={chartOptions}  style={{ height: '500px'}}/>

                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                        <TextField
                            label={"NPL Value"}
                            value={npl.toFixed(8)}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        </Grid>
                    {Object.keys(variables).map((key) => (
                        // eslint-disable-next-line react/jsx-key
                        <Grid item xs={3}>
                            <TextField
                                key={key}
                                label={key}
                                value={variables[key]}
                                margin="normal"
                                fullWidth
                                disabled={true}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    ))}
                    </Grid>
                </div>
            )}
        </>
    );
};

export default App;