export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params


  return (
    <>
      <h1>Shop</h1>
      <p>Slug: {slug}</p>
    </>
  )
}