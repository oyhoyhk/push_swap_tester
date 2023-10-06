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
        else:
            return {"type": False, "msg": "No Param test Failed"}
    except FileNotFoundError:
        return {"type": False, "msg": "No param test Failed"}
    except Exception as e:
        return {"type": False, "msg": "No param test Failed"}
    finally:
        os.chdir(original_directory)


invalid_param_testcases = [
    ["./push_swap", "test"],
    ["./push_swap", "a", "2", "5", "3", "6"],
    ["./push_swap", "525a"],
    ["./push_swap", "$@#$123"],
    ["./push_swap", "\n"],
]


def test_invalid_params(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        for testcase in invalid_param_testcases:
            result = subprocess.run(
                testcase,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.stdout != "Error\n":
                return {"type": False, "msg": "Invalid params test Failed"}
        return {"type": True, "msg": "Invalid params test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "Invalid params test Failed"}
    except Exception as e:
        return {"type": False, "msg": "Invalid params test Failed"}
    finally:
        os.chdir(original_directory)


duplicated_params_testcases = [
    ["./push_swap", "1", "1"],
    ["./push_swap", "5", "4", "2", "3", "3"],
    ["./push_swap", "100", "100", "100", "100", "100"],
    ["./push_swap", "5", "5", "4", "4", "3", "3"],
    ["./push_swap", "-1", "-1", "-2", "-2", "-3"],
]


def test_param_duplication(id: str):
    original_directory = os.getcwd()
    try:
        dir = os.path.join("repo", id)
        os.chdir(dir)

        for testcase in duplicated_params_testcases:
            result = subprocess.run(
                testcase,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.stdout != "Error\n":
                return {"type": False, "msg": "Duplicated params test Failed"}
        return {"type": True, "msg": "Duplicated params test Success"}
    except FileNotFoundError:
        return {"type": False, "msg": "Duplicated params test Failed"}
    except Exception as e:
        return {"type": False, "msg": "Duplicated params test Failed"}
    finally:
        os.chdir(original_directory)
