import os
import subprocess


def test_no_param(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)
        os.chmod(os.path.join(os.getcwd(), "push_swap"), 0o755)

        result = subprocess.run(
            ["./push_swap"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        if len(result.stdout) == 0:
            return {"type": True, "msg": "No param test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "No param test Failed"}
    except Exception as e:
        return {"type": False, "msg": "No param test Failed"}
    finally:
        os.chdir(original_directory)


def test_invalid_params(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        print(os.getcwd())
        result = subprocess.run(
            ["./push_swap", "test"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        print("invalid params test")
        print(result.stdout)
        if result.stdout == "Error\n":
            return {"type": True, "msg": "Invalid params test Success"}
        else:
            return {"type": False, "msg": "Invalid params test Failed"}
    except FileNotFoundError:
        return {"type": False, "msg": "Invalid params test Failed"}
    except Exception as e:
        return {"type": False, "msg": "Invalid params test Failed"}
    finally:
        os.chdir(original_directory)


if __name__ == "__main__":
    print("test_no_params")
    test_no_param("42YerevansProjects")
    print(test_invalid_params("42YerevansProjects"))
