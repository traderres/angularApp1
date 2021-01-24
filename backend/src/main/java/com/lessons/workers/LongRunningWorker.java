package com.lessons.workers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Callable;

public class LongRunningWorker implements Callable<String> {
    private static final Logger logger = LoggerFactory.getLogger(LongRunningWorker.class);


    @Override
    public String call() throws Exception {
        logger.debug("call() started.");

        // Simulate a long running process
        Thread.sleep(5000);


        logger.debug("call() finished.");
        return null;
    }
}
