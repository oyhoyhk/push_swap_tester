import os
import subprocess


def test_make(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        result = subprocess.run(
            ["make"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        if result.returncode != 0:
            error_message = result.stderr
            print("Make Error Occurred", error_message)
            return {"type": False, "stdout": error_message}

        if not os.path.exists("push_swap"):
            raise Exception("There is no push_swap!")

        print("make test", result.stdout)
        return {"type": True, "stdout": "make test success"}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "stdout": str(e)}
    finally:
        os.chdir(original_directory)


def test_make_re_link(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        result = subprocess.run(
            ["make"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        output = result.stdout

        print(output)

        if (
            "make: Nothing to be done for 'all'." in output
            or "make: Nothing to be done for `all'." in output
        ):
            return {"type": True, "stdout": "make re-link test Success"}
        else:
            return {"type": False, "stdout": "make re-link test Failed"}
    except Exception as e:
        print("invalid Path", e)
        return {
            "type": False,
            "stdout": "make re-link test Failed",
        }
    finally:
        os.chdir(original_directory)


def test_make_re(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        result = subprocess.run(
            ["make", "re"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        if not os.path.exists("push_swap"):
            raise Exception("There is no push_swap!")
        return {"type": True, "stdout": "make re Test Success"}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "stdout": result.stderr}
    finally:
        os.chdir(original_directory)


def test_make_clean(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        result = subprocess.run(
            ["make", "clean"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        for root, dirs, files in os.walk(os.getcwd()):
            for file in files:
                if file.endswith(".o"):
                    return {
                        "type": False,
                        "stdout": "make clean test Failed",
                    }

        subprocess.run(
            ["make"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        return {"type": True, "stdout": "make clean test Success"}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "stdout": "make clean test Failed"}
    finally:
        os.chdir(original_directory)


def test_make_fclean(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        result = subprocess.run(
            ["make", "fclean"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        for root, dirs, files in os.walk(os.getcwd()):
            if '.dSYM' in root:
                continue
            for file in files:
                if file.endswith(".o") or file == "push_swap":
                    print('pwd : ', dir, 'file : ',  file)
                    return {
                        "type": False,
                        "stdout": "make fclean test Failed",
                    }

        subprocess.run(
            ["make"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        return {"type": True, "stdout": "make fclean test Success"}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "stdout": "make fclean test Failed"}
    finally:
        os.chdir(original_directory)
