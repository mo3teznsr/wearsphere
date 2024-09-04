<?php


namespace App\Repositories;

use Marvel\Database\Models\Account;
use Marvel\Database\Repositories\BaseRepository;

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
