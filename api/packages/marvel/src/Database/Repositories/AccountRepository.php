<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\Account;

class AccountRepository extends BaseRepository
{
    /**
     * Configure the Model
     **/
    public function model()
    {
        return Account::class;
    }
}
