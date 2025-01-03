import React from "react";

const NotFound = () => {
  return (
    <div className="w-screen h-screen m-0 flex flex-col items-center justify-center text-gray-700 bg-[#C2FFC7] dark:text-Black dark:bg-[#C2FFC7] font-sans text-base leading-relaxed">
      <div className="max-w-full text-center">
        <strong className="block text-3xl mb-6">404 Not Found</strong>
        <div>
          お探しのページは見つかりませんでした。
          <br /> ご指定いただいたアドレスが間違っているか、ページが移動または削除された可能性があります。
        </div>
      </div>
    </div>
  );
};

export default NotFound;
