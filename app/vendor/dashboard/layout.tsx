export default function vendorlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col text-black bg-gray-800 ">
      <div className="w-full h-16 flex  bg-amber-300">
        <div>
            logo
        </div>

        <button className=" border px-2  border-black rounded-2xl bg-red-800">
            logout
        </button>
        </div>
      <div className="flex h-screen bg-green-400">
        <div className="w-1/8 bg-red-600">sidebar</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
