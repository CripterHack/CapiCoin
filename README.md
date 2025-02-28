# CapiCoin (CAPI)

CapiCoin es un token BEP-20 desarrollado en la Binance Smart Chain (BSC) con un enfoque en la sustentabilidad, ética y justicia. El token implementa un sistema de tarifas de transacción que beneficia directamente a refugios de animales y proyectos ecológicos.

## Características Principales

- **Nombre:** Capibara
- **Símbolo:** CAPI
- **Suministro Total:** 1,000,000,000 CAPI
- **Decimales:** 18
- **Red:** Binance Smart Chain (BSC)

### Sistema de Tarifas de Transacción (2% total)
- 1% donación automática a refugios de animales y proyectos ecológicos
- 0.5% quema automática de tokens
- 0.5% fondo de desarrollo y marketing

## Descripción Técnica

CapiCoin es un token BEP-20 que implementa características avanzadas de tokenomics y seguridad:

### Características de Seguridad
- Protección contra reentrancia en todas las funciones críticas
- Sistema de roles y permisos basado en OpenZeppelin
- Protección contra overflow/underflow matemático
- Validaciones exhaustivas en todas las transacciones
- Eventos detallados para auditoría y seguimiento
- Tests unitarios completos con cobertura del 100%

### Tokenomics
- Sistema de quema automática para deflación controlada
- Mecanismo de donación automática para causas benéficas
- Fondo de desarrollo para sostenibilidad del proyecto
- Distribución transparente de tarifas

## Requisitos Previos

- Node.js (v12 o superior)
- npm o pnpm
- Truffle Suite (`npm install -g truffle`)
- MetaMask con BSC configurada
- BNB para gas (testnet/mainnet)

## Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd CapiCoin
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
   - Crear archivo `.env` basado en `.env.example`
   - Configurar:
     ```
     MNEMONIC="tu frase semilla de 12 palabras"
     BSCSCAN_API_KEY="tu api key de bscscan"
     BSC_TESTNET_RPC="https://data-seed-prebsc-1-s1.binance.org:8545"
     BSC_MAINNET_RPC="https://bsc-dataseed.binance.org"
     ```

## Desarrollo y Testing

### Compilación
```bash
truffle compile
```

### Tests Unitarios
```bash
truffle test
```

Los tests incluyen:
- ✓ Inicialización correcta del token
- ✓ Sistema de tarifas y transferencias
- ✓ Gestión de carteras y permisos
- ✓ Pruebas de seguridad (reentrancia, overflow)
- ✓ Auditoría de eventos y estado
- ✓ Cálculos de tarifas y precisión

### Despliegue

1. Red de pruebas (Testnet):
```bash
truffle migrate --network bscTestnet
```

2. Red principal (Mainnet):
```bash
truffle migrate --network bscMainnet
```

## Estructura del Proyecto

```
CapiCoin/
├── contracts/           # Contratos inteligentes Solidity
│   └── CapiToken.sol    # Contrato principal del token
├── migrations/          # Scripts de migración
├── test/               # Tests unitarios
│   └── CapiToken.test.js # Tests principales
├── truffle-config.js   # Configuración de red y compilador
└── .env               # Variables de entorno (no compartir)
```

## Glosario de Términos

### Conceptos Blockchain
- **Gas**: Unidad que mide el costo computacional de ejecutar transacciones en la blockchain. Se paga en BNB en la BSC.
- **BEP-20**: Estándar de token en Binance Smart Chain, similar a ERC-20 de Ethereum.
- **Smart Contract**: Programa autoejecutable que vive en la blockchain.
- **Wallet**: Dirección que puede contener tokens y realizar transacciones.

### Términos del Proyecto
- **Quema de Tokens**: Proceso de enviar tokens a una dirección inutilizable, reduciendo el suministro total.
- **Cartera de Desarrollo**: Dirección que recibe fondos para mantenimiento y marketing.
- **Cartera de Donaciones**: Dirección destinada a proyectos benéficos.
- **Tokenomics**: Economía y distribución del token.

## Seguridad

### Medidas Implementadas
- Protección contra reentrancia (ReentrancyGuard)
- Sistema de roles (Ownable)
- Matemáticas seguras (SafeMath implícito en Solidity >0.8.0)
- Validaciones de dirección cero
- Eventos para trazabilidad

### Mejores Prácticas
- Nunca compartir claves privadas o semillas
- Usar carteras diferentes para desarrollo y producción
- Mantener las variables de entorno seguras
- Realizar auditorías antes del despliegue en mainnet

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.

### ¿Por qué MIT?

La Licencia MIT fue elegida específicamente para este proyecto por:

- **Apertura y Transparencia**: Permite que cualquiera pueda verificar el código del token, alineado con nuestros valores de transparencia.
- **Compatibilidad**: Facilita la integración con exchanges y otras plataformas.
- **Comunidad**: Fomenta la participación y mejora del código.
- **Protección**: Incluye una cláusula de no garantía que protege a los desarrolladores.

### Términos Principales

- ✓ Uso comercial permitido
- ✓ Modificación permitida
- ✓ Distribución permitida
- ✓ Uso privado permitido
- ✓ Sublicenciamiento permitido
- ℹ️ Debe incluir el aviso de copyright
- ℹ️ Debe incluir la licencia
- ❌ Sin garantías proporcionadas

## Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Contacto y Soporte

- **Documentación**: [Link a la documentación]
- **Issues**: Usar el sistema de issues de GitHub
- **Comunidad**: [Links a redes sociales/Discord] 