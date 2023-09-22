import styled from "@emotion/styled";

const ReadFile = ({setCommands}: { setCommands: React.Dispatch<React.SetStateAction<string[]>> }) => {

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        const reader = new FileReader();

        reader.onload = function (e: ProgressEvent<FileReader>) {
            if (!e.target) return;
            const fileContents = e.target.result;
            console.log(fileContents);
            if (!fileContents) return;
            setCommands(fileContents.toString().trim().split('\n').map(el => el.trim()));
        };
        reader.readAsText(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <>
            <ReadFileContainer
                htmlFor="file"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                Click or Drag your push_swap result
                <AddIcon/>
            </ReadFileContainer>
            <input style={{display: "none"}} type="file" id="file"/>
        </>
    );
};

const AddIcon = styled.div`
  width: 42px;
  height: 42px;
  background: url("/add.png");
  background-size: 100% 100%;
`;

const ReadFileContainer = styled.label`
  font-size: 1.5rem;
  width: 570px;
  height: 80px;
  border: 2px solid white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

export default ReadFile;
