import { useContext } from 'react'
import { EmpresaContext } from '../context/EmpresaContext'

export const useEmpresa = () => useContext(EmpresaContext)
