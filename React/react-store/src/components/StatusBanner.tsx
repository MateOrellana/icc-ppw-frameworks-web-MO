function StatusBanner() {
  const totalProductos = 150
  const categorias = ['Electronica', 'Ropa', 'Hogar', 'Deportes']

  return (
    <section style={{
      background: '#e8f4fd',
      padding: '1rem',
      margin: '1rem',
      borderRadius: '8px'
    }}>
      <h2>Catalogo</h2>
      <p>{totalProductos} productos disponibles</p>
      <p>Categorias: {categorias.join(' · ')}</p>
    </section>
  )
}

export default StatusBanner