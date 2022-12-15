import React from "react";
import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Vibration, Share } from "react-native";

import { styles } from "./style";

import BmiInfo from "../bmiInfo";

export default function Form() {
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [error, setError] = useState<boolean>(false)
  const [imcValue, setImcValue] = useState<number>()

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Meu IMC hoje é de: ${imcValue?.toFixed(1)} Kg/m² `
      })
    } catch (error) {
      console.log(error)
    }
  }

  function validateInputs() {

    if (imcValue !== undefined) {
      refresh()

    } else if (height == "" || weight == "" || isNaN(parseFloat(height)) || isNaN(parseInt(weight))) {
      setError(true)
      Vibration.vibrate()
      setTimeout(() => refresh(), 2000)
      setTimeout(() => setError(false), 2000)

    } else {
      return calculateImc()
    }
  }

  function calculateImc() {
    setImcValue(parseInt(weight.replace(",", ".")) / (parseFloat(height.replace(",", ".")) * parseFloat(height.replace(",", "."))))
  }

  function refresh() {
    setHeight("")
    setWeight("")
    setImcValue(undefined)
  }

  return (
    <View style={styles.formBox}>
      <Text style={styles.formText}>Altura</Text>
      {
        error ? (
          height == "" ? (
            <Text style={styles.inputErrorText}>Esse campo é obrigatório</Text>
          ) : isNaN(parseFloat(height)) ? (
            <Text style={styles.inputErrorText}>Os dados inseridos não são númericos!</Text>
          ) : (
            null
          )
        ) : (
          null
        )
      }
      <TextInput
        style={styles.formInput}
        keyboardType='numeric'
        maxLength={4}
        placeholder="Ex: 1.80"
        value={height}
        onChangeText={setHeight}
      />
      <Text style={styles.formText}>Peso</Text>
      {
        error ? (
          weight == "" ? (
            <Text style={styles.inputErrorText}>Esse campo é obrigatório</Text>
          ) : isNaN(parseFloat(weight)) ? (
            <Text style={styles.inputErrorText}>Os dados inseridos não são númericos!</Text>
          ) : (
            null
          )
        ) : (
          null
        )
      }
      <TextInput
        style={styles.formInput}
        keyboardType='numeric'
        maxLength={5}
        placeholder="Ex: 70.55"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.formButton} onPress={() => validateInputs()}>
        <Text style={styles.formButtonText}>{imcValue ? 'Calcular Novamente' : 'Calcular'}</Text>
      </TouchableOpacity>

      {
        error ? (
          <Text style={styles.formErrorText}>Preencha os dados corretamente!</Text>
        ) : (
          <></>
        )
      }

      {
        imcValue !== undefined ? (
          <>
            <BmiInfo value={imcValue} />
            <TouchableOpacity style={styles.shareButton} onPress={() => onShare()}>
              <Text style={styles.shareButtonText}>Compartilhar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )
      }

    </View>
  )
}