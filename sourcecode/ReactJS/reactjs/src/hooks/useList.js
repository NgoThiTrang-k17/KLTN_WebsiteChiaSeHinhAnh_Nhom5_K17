import { useState } from "react";

function useList(init) {
  const [list, setList] = useState(init);
  return {
    list,
    removeItem(item) {
      const filterdList2 = list.filter((v) => v.name !== item);
      setList(filterdList2);
    },
    saveItem(index, val) {
      const copyList = [...list];
      copyList[index].name = val;
    },
  };
}
export default useList;
