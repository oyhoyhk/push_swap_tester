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
            raise Exception("Make Compile Failed")

        if not os.path.exists("push_swap"):
            raise Exception("There is no push_swap!")

        print("make test", result.stdout)
        return {"type": True, "msg": "make test Success", "stdout": result.stdout}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "msg": "make test Failed", "stdout": result.stderr}
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
            return {
                "type": True,
                "msg": "make re-link test Success",
                "stdout": result.stdout,
            }
        else:
            return {
                "type": False,
                "msg": "make re-link test Failed",
                "stdout": result.stdout,
            }
    except Exception as e:
        print("invalid Path", e)
        return {
            "type": False,
            "msg": "make re-link test Failed",
            "stdout": result.stderr,
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
        return {"type": True, "msg": "Make Test Success", "stdout": result.stdout}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "msg": "make re test failed", "stdout": result.stderr}
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
                        "msg": "make clean test Failed",
                        "stdout": f"{root}/{dir}/{file} exists!",
                    }

        subprocess.run(
            ["make"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        return {"type": True, "msg": "make clean test Success", "stdout": result.stdout}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "msg": "make clean test Failed", "stdout": result.stderr}
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
            for file in files:
                if file.endswith(".o") or file == "push_swap":
                    return {
                        "type": False,
                        "msg": "make fclean test Failed",
                        "stdout": f"{root}/{dirs}/{file} exists!",
                    }

        subprocess.run(
            ["make"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        return {"type": True, "msg": "make clean test Success", "stdout": result.stdout}
    except Exception as e:
        print("invalid Path", e)
        return {"type": False, "msg": "make clean test Failed", "stdout": result.stderr}
    finally:
        os.chdir(original_directory)
