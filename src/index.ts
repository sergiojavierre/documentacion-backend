import express from 'express';
import dotenv from "dotenv"

import {routerEstudiantes} from './routes/estudiantes.router'
import {routerSolicitudes} from './routes/solicitudes.router'

dotenv.config()

const app = express();
app.use(express.json())

const port = process.env.PORT

//routers
app.use('/estudiantes', routerEstudiantes)
app.use('/solicitudes', routerSolicitudes)

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${port}`);
});