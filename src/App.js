import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import dotenv from 'dotenv';


dotenv.config();

function App() {
  const [time, setTime] = useState('');
  const [weight, setWeight] = useState('');
  const [plateWeight, setPlateWeight] = useState('');
  const [bucketWeight, setBucketWeight] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/data/user`);
        setTime(response.data.hora);
        setWeight(response.data.gramos);
        setPlateWeight(response.data.plateWeight);
        setBucketWeight(response.data.bucketWeight);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleWeightChange = (e) => {
    const value = Math.max(0, Math.min(e.target.value, 255));
    setWeight(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/data`, { hora: time, gramos: weight });
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleFeedPet = async (e) => {
    e.preventDefault();
    console.log('Botón "Dar Comida" clickeado');
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/darComida`);
      console.log('Comida dada exitosamente');
    } catch (error) {
      console.error('Error al dar comida:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Información del comedero de perros</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">
          Hora:
          <input type="time" value={time} onChange={handleTimeChange} className="form-input" />
        </label>
        <label className="form-label">
          Gramos a servir:
          <input type="number" value={weight} onChange={handleWeightChange} min="0" max="255" className="form-input" />
        </label>
        <button type="submit" className="submit-button">Actualizar</button>
      </form>
      <p className="info">Peso del tacho de comid: {plateWeight} g</p>
      <p className="info">Peso del plato: {bucketWeight} g</p>
      <button onClick={handleFeedPet} type= "submit"className="submit-button">Dar Comida</button>
    </div>
  );
}

export default App;