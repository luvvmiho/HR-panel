export default function someCard(){
    const divCount = 3;
    return(
        <div className="flex flex-wrap mt-4 ">
            {[...Array(divCount)].map((_, index) => (
            <div key={index} className=" w-[450px]  h-[200px] rounded-xl shadow-2xl m-4 bg-white p-10">
                <p className="font-bold text-l pb-2">Tip {index + 1} </p>
                <p className="text-gray-500 text-sm pb-2">This is a short description of the tip or news item. Click below to read more.</p>
                <a href="/" className="text-blue-400">Read more</a>
            </div>
      ))}
 
        </div>


    )

}