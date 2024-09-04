<?php

namespace Marvel\Listeners;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Marvel\Console\MarvelVerification;
use Marvel\Database\Models\Settings;
use Marvel\Events\ProcessUserData;

class AppDataListener
{
    private $appData;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ProcessUserData  $event
     * @return void
     */
    public function handle(ProcessUserData $event)
    {
        $config = new MarvelVerification();
        $last_checking_time = $config->getLastCheckingTime();
        $lastCheckingTimeDifferenceFromNow = Carbon::parse($last_checking_time)->diffInHours(Carbon::now());
        if ($lastCheckingTimeDifferenceFromNow < 12) return;
        $key = $config->getPrivateKey();
        $language = isset(request()['language']) ? request()['language'] : DEFAULT_LANGUAGE;
        $config->verify($key)->modifySettingsData($language);
    }
}
