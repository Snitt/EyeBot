module.exports = (closeEvent) => {
  if (closeEvent.code === 1000) process.exit()
}
