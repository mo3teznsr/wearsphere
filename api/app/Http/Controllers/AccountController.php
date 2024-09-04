<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Repositories\AccountRepository;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\AccountRequest;
use Prettus\Validator\Exceptions\ValidatorException;
use Marvel\Http\Controllers\CoreController;
class AccountController extends Controller
{
    public $repository;

    public function __construct()
    {
      // $this->repository = $repository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Account[]
     */
    public function index(Request $request)
    {
        return Account::where('customer_id', $request->user()->id)->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AccountRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->all();
            return Account::create([...$validatedData, 'customer_id' => $request->user()->id]);
        } catch (MarvelException $e) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            return $this->repository->with('customer')->findOrFail($id);
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AccountRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->all();
            return Account::findOrFail($id)->update($validatedData);
        } catch (MarvelException $e) {
            throw new MarvelException(COULD_NOT_UPDATE_THE_RESOURCE);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id, Request $request)
    {
        try {
            $user = $request->user();
            if ($user && $user->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return $this->repository->findOrFail($id)->delete();
            } else {
                $Account = Account::findOrFail($id);
                if ($Account->customer_id == $user->id) {
                    return $Account->delete();
                }
            }
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }
}
